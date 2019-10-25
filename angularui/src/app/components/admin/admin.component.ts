import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../models/page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AlertifyService } from '../../services/alertify.service';
import { Post } from 'src/app/models/post';
import {MyUploadAdapter} from '../../helpers/MyUploader';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {


  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService
  ) { }

  pages: any;
  selectedpage: any;
  updateForm: FormGroup;
  alrt: string;
  activeUser: User;
  users: User[] = [];
  posts: Post[] = [];
  registerForm: FormGroup;
  upd: string;
  updPost: string;
  pageImage: string;
  Editor = ClassicEditorBuild;
  editorConfig = {
    placeholder: 'Birşeyler yazın..'
  };
  userGroupSubmitted: boolean = false;
  postGroupSubmitted: boolean = false;

  ngOnInit() {
    const raw = JSON.parse(localStorage.getItem('ActiveUser'));
    if (!raw) {
      this.alertify.error('Lütfen giriş yapınız!');
      this.router.navigate(['/login']);
    }
    this.activeUser = new User();
    this.activeUser.internalId = raw.internalId;
    this.activeUser.userEmail = raw.userEmail;

    // If the user is an editor than show only post page
    if (raw.userType === 2) {
      document.getElementById('usersli').remove();
      document.getElementById('pagesli').remove();
      document.getElementById('users').remove();
      document.getElementById('pages').remove();
      document.getElementById('posts').className = 'container tab-pane active';
    }
    this.LoadAllUsers();
    this.selectedpage = {
      internalId: '',
      pageName: '',
      pageTitle: '',
      pageContent: '',
      Image: ''
    };
    this.updateForm = this.formBuilder.group({ pageName: '', pageTitle: '', pageContent: '', Image: '' });
    this.FetchPageContents();
    this.registerForm = this.formBuilder.group({
      userGroup: this.formBuilder.group({
        userEmail: ['', [Validators.required, Validators.email]],
        userPassword: ['', [Validators.required, Validators.minLength(3)]],
        userType: [''],
        userStatus: [''],
      }),
      postGroup: this.formBuilder.group({
        postState: [''],
        postAuthor: [''],
        postImage: [''],
        postContentBrief: ['', Validators.required],
        postContentExtended: ['', Validators.required],
      })
    });
    this.upd = '';
    this.updPost = '';
    this.getAllPosts();
  }

  onReady($event) {
    $event.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  get fe() { return (this.registerForm.get('userGroup') as FormGroup).controls; }

  get fc() { return (this.registerForm.get('postGroup') as FormGroup).controls; }

  get userGroup() {
    return this.registerForm.get('userGroup');
  }

  get postGroup() {
    return this.registerForm.get('postGroup');
  }

  LoadAllUsers() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient.get(API_URL + '/api/users/GetAll', { headers: header })
      .subscribe((res: User[]) => {
        this.users = res;
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // console.log(err.error.message);
          this.alertify.error(err.error.message);
        } else if (err.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
  }

  CheckAuthorize(inputToken: string, userMail: string) {
    var obj = JSON.parse('{ "userEmail":""}');
    obj.userEmail = userMail;
    const _header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${inputToken}`
    });
    this.httpClient
      .post(API_URL + '/api/users/UserAccount', obj, { headers: _header })
      .subscribe(res => {
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.router.navigate(['/login']);
        }
      });
  }

  FetchPageContents() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .get(API_URL + '/api/pages/GetAllPages', { headers: header })
      .subscribe((res: Page[]) => {
        this.pages = res;
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // console.log(err.error.message);
          this.alertify.error(err.error.message);
        } else if (err.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('CMS_Token');
    localStorage.removeItem('ActiveUser');
    this.router.navigate(['/login']);
  }

  changePage(e) {
    // alert(e.target.value);
    this.selectedpage = this.pages[e.target.value];
  }

  updatePage() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });

    let obj = JSON.parse('{ "pageName":"", "pageTitle":"", "pageContent":"", "Image":""}');
    obj.pageName = this.selectedpage.pageName;
    obj.pageTitle = this.updateForm.get('pageTitle').value;
    obj.pageContent = this.updateForm.get('pageContent').value;
    obj.Image = this.pageImage ? this.pageImage : null;
    // console.log(obj.pageName);
    this.httpClient
      .post(API_URL + '/api/pages/UpdatePage', obj, { headers: header })
      .subscribe((res: any) => {
        this.alertify.success(res.message.toString());
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // console.log(err.error.message);
          this.alertify.error(err.error.message);
        } else if (err.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
  }

  deleteUser(id: string) {
    if (this.activeUser.internalId === id) {
      this.alertify.error('Kendi kullanıcını silemezsin!');
      return;
    }
    if (!confirm('Emin misin?')) {
      return;
    }
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .delete(API_URL + '/api/users/' + id, { headers: header })
      .subscribe(res => {
        this.alertify.success('Kullanıcı silindi.');
        this.LoadAllUsers();
      }, (error: HttpErrorResponse) => {
        if (error.status === 400) {
          // console.log(err.error.message);
          this.alertify.error(error.error.message);
        } else if (error.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
  }

  // Submitting the usergroup
  onSubmit() {
    this.userGroupSubmitted = true;

    // stop here if form is invalid
    if (this.userGroup.invalid) {
      return;
    }
    if (this.upd !== '') {
      this.updateUser(this.upd);
      return;
    }
    // Kullanıcı verisini hazırla
    let obj = new User();
    // obj.internalId = '';
    obj.userEmail = this.userGroup.get('userEmail').value;
    obj.userPassword = this.userGroup.get('userPassword').value;
    obj.userType = this.userGroup.get('userType').value;
    // obj.userStatus = this.registerForm.get('userStatus').value;
    // obj.userCreated = new Date();
    // obj.userModified = new Date();

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .post(API_URL + '/api/users/AddUser', obj, { headers: header })
      .subscribe((res: any) => {
        this.alertify.success(res.message.toString());
        this.LoadAllUsers();
        this.userGroup.reset();
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.alertify.error(err.error.message);
        } else if (err.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
  }

  updateUser(id: string) {
    let obj = JSON.parse('{ "_id":"", "useremail":"", "userpassword":"","usertype":"","userstatus":""}');
    obj._id = '{"$oid":' + id + '}';
    obj.useremail = this.userGroup.get('userEmail').value;
    obj.userpassword = this.userGroup.get('userPassword').value;
    obj.usertype = this.userGroup.get('userType').value;
    obj.userstatus = this.userGroup.get('userStatus').value;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .put(API_URL + '/api/users/' + id, obj, { headers: header })
      .subscribe((res: any) => {
        this.alertify.success(res.message.toString());
        this.LoadAllUsers();
        this.userGroup.reset();
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // console.log(err.error.message);
          this.alertify.error(err.error.message);
        } else if (err.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
    this.upd = '';
  }

  getValue(id: string) {
    this.upd = id;
    var found = this.users.filter(x => x.internalId === id)[0];
    this.userGroup.get('userEmail').setValue(found.userEmail);
    this.userGroup.get('userPassword').setValue(found.userPassword);
    this.userGroup.get('userType').setValue(found.userType);
    this.userGroup.get('userStatus').setValue(found.userStatus);
  }

  getPost(id: string) {
    this.updPost = id;
    var found = this.posts.filter(x => x.internalId === id)[0];
    this.postGroup.get('postContentBrief').setValue(found.postContentBrief);
    this.postGroup.get('postContentExtended').setValue(found.postContentExtended);
    this.postGroup.get('postImage').setValue(found.postImage);
    this.postGroup.get('postState').setValue(found.postState);
  }

  // submitting the postgroup
  submitPost() {
    this.postGroupSubmitted = true;
    if (this.postGroup.invalid) {
      return;
    }
    if (this.updPost !== '') {
      this.updatepost(this.updPost);
      return;
    }
    // Post verisini hazırla
    let activeUser =  JSON.parse(localStorage.getItem('ActiveUser')) as User;
    let obj = new Post();
    obj.postAuthor =  activeUser.userEmail;
    obj.postContentBrief = this.postGroup.get('postContentBrief').value;
    obj.postContentExtended = this.postGroup.get('postContentExtended').value;
    obj.postImage = null;
    obj.postState = this.postGroup.get('postState').value;
    obj.postModifiedDate = obj.postPublishedDate = new Date();

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .post(API_URL + '/api/posts/addpost', obj, { headers: header })
      .subscribe((res: any) => {
        this.alertify.success(res.message.toString());
        this.getAllPosts();
        this.postGroup.reset();
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.alertify.error(err.error.message);
        } else if (err.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
  }

  onFileChange(event) {
    var files = event.target.files;
    var file = files[0];
    if (files && file) {
      var reader = new FileReader();
      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleFile(event) {
    this.pageImage = event.target.result;
    this.pageImage = btoa(this.pageImage);
    // console.log(this.pageImage);
  }

  getAllPosts() {
    this.httpClient.get(API_URL + '/api/posts/getposts').subscribe(
      (response: Post[]) => {
        this.posts = response.filter(post => post.postState === 'Draft' || post.postState === 'Published');
      },
      (err: HttpErrorResponse) => {
        this.alertify.error(err.message);
      }
    );
  }

  archivePost(id: string) {
    if (confirm('Postu arşivlemek istediğinizden emin misiniz?')) {
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
      });
      this.httpClient.post(API_URL + '/api/posts/UpdatePostState?id=' + id + '&type=Archived', null, { headers: header }).subscribe(
        (res: any) => {
          this.alertify.success(res.message.toString());
        },
        (err: HttpErrorResponse) => {
          this.alertify.error(err.message);
        }
      );
    }
  }

  publishPost(id: string) {
    if (confirm('Postu yayınlamak istediğinizden emin misiniz?')) {
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
      });
      this.httpClient.post(API_URL + '/api/posts/UpdatePostState?id=' + id + '&type=Published', null, { headers: header }).subscribe(
        (res: any) => {
          this.alertify.success(res.message.toString());
        },
        (err: HttpErrorResponse) => {
          this.alertify.error(err.message);
        }
      );
    }
  }

  updatepost(id: string) {
    let obj = new Post();
    obj.postContentBrief = this.postGroup.get('postContentBrief').value;
    obj.postContentExtended = this.postGroup.get('postContentExtended').value;
    obj.postImage = null;
    obj.postState = this.postGroup.get('postState').value;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .put(API_URL + '/api/posts/' + id, obj, { headers: header })
      .subscribe((res: any) => {
        this.alertify.success(res.message.toString());
        this.getAllPosts();
        this.postGroup.reset();
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // console.log(err.error.message);
          this.alertify.error(err.error.message);
        } else if (err.status === 401) {
          this.alertify.error('Tekrar giriş yapınız!');
          this.router.navigate(['/login']);
        }
      });
    this.updPost = '';
  }
}


