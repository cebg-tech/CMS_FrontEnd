import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../models/page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private httpClient: HttpClient, private formBuilder: FormBuilder) {}
  pages: any;
  selectedpage: any;
  updateForm: FormGroup;
  alrt: string;
  activeUser: User;
  users: User[] = [];
  submitted: boolean;
  registerForm: FormGroup;
  upd: string;
  pageImage: string;

  ngOnInit() {
    this.submitted  = false;
    const raw = JSON.parse(localStorage.getItem('ActiveUser'));
    if (raw === undefined) {
      alert('Aktif kullanıcı null olamaz'); return; }
    this.activeUser = new User();
    this.activeUser.internalId = raw.internalId;
    this.activeUser.userEmail = raw.userEmail;
    this.LoadAllUsers();
    this.selectedpage = {
      internalId: '',
      pageName: '',
      pageTitle: '',
      pageContent: '',
      Image: ''
    };
    this.updateForm = this.formBuilder.group({ pageName: '' , pageTitle: '', pageContent: '', Image: ''});
    // this.CheckAuthorize(localStorage.getItem('CMS_Token'), this.activeUser.useremail);
    this.FetchPageContents();
    this.registerForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(3)]],
      userType: [''],
      userStatus: [''],
  });
  }

  get f() { return this.registerForm.controls; }

  LoadAllUsers() {
    console.log('loadallusers');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient.get(API_URL + '/api/users/GetAll', { headers: header })
      .subscribe((res: User[]) => {
      this.users = res;
      });
  }

  CheckAuthorize(inputToken: string, userMail: string) {
      console.log('admin.checkauthorize');
      var obj = JSON.parse('{ "userEmail":""}');
      obj.userEmail = userMail;
      const _header = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${inputToken}`
      });
      this.httpClient
        .post(API_URL + '/api/users/UserAccount', obj , { headers: _header })
        .subscribe(res => {
        }, (err: HttpErrorResponse) => {
          if (err.status === 400) {
            // console.log(err.error.message);
            this.router.navigate(['/login']);
          }});
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
        console.log(this.pages);
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
    obj.Image = this.pageImage;
    // console.log(obj.pageName);
    this.httpClient
      .post(API_URL + '/api/pages/UpdatePage', obj , { headers: header })
      .subscribe((res: any) => {
       console.log(res);
       this.alrt = res.message.toString();
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // console.log(err.error.message);
          this.alrt = err.error.message;
        }
    });
  }

  deleteUser(id: string) {
    if ( this.activeUser.internalId === id) {
      this.alrt = 'Kendi kullanıcını silemezsin!';
      return;
    }
    if (!confirm('Emin misin?'))
    {
      return;
    }
    console.log('sil ' + id);
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .delete(API_URL + '/api/users/' + id, { headers: header })
      .subscribe(res => {
        this.alrt = 'Kullanıcı silindi.';
        this.LoadAllUsers();
      });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    if (this.upd !== '') {
      console.log('Update');
      this.updateUser(this.upd);
      return;
    }
    // Kullanıcı verisini hazırla
    let obj = new User();
    // obj.internalId = '';
    obj.userEmail = this.registerForm.get('userEmail').value;
    obj.userPassword = this.registerForm.get('userPassword').value;
    obj.userType = this.registerForm.get('userType').value;
    // obj.userStatus = this.registerForm.get('userStatus').value;
    // obj.userCreated = new Date();
    // obj.userModified = new Date();

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .post(API_URL + '/api/users/AddUser', obj , { headers: header })
      .subscribe((res: any) => {
       this.alrt = res.message.toString();
       this.LoadAllUsers();
       this.registerForm.reset();
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.alrt = err.error.message;
        }
    });
  }

  updateUser(id: string) {
    let obj = JSON.parse('{ "_id":"", "useremail":"", "userpassword":"","usertype":"","userstatus":""}');
    obj._id = '{"$oid":' + id + '}';
    obj.useremail = this.registerForm.get('userEmail').value;
    obj.userpassword = this.registerForm.get('userPassword').value;
    obj.usertype = this.registerForm.get('userType').value;
    obj.userstatus = this.registerForm.get('userStatus').value;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    this.httpClient
      .put(API_URL + '/api/users/' + id, obj , { headers: header })
      .subscribe((res: any) => {
       console.log(res);
       this.alrt = res.message.toString();
       this.LoadAllUsers();
       this.registerForm.reset();
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // console.log(err.error.message);
          this.alrt = err.error.message;
        }
    });
    this.upd = '';
  }

  getValue(id: string) {
    this.upd = id;
    var found = this.users.filter(x => x.internalId === id)[0];
    this.registerForm.get('userEmail').setValue(found.userEmail);
    this.registerForm.get('userPassword').setValue(found.userPassword);
    this.registerForm.get('userType').setValue(found.userType);
    this.registerForm.get('userStatus').setValue(found.userStatus);
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
    console.log(this.pageImage);
   }
}
