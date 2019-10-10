import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/user';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  constructor(private httpClient: HttpClient, private router: Router, private formBuilder: FormBuilder) {}
  alrt: string;
  tokenKey: string;
  email: string;
  password: string;
  registerForm: FormGroup;
  submitted = false;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
  });
  }

  get f() { return this.registerForm.controls; }

  Login(email: string, password: string) {
    this.httpClient
      .post(API_URL + '/api/users/authenticate', {
        useremail: email,
        userpassword: password
      }, { observe: 'response' })
      .subscribe((response: any)  => {
        localStorage.setItem ('CMS_Token', response.body.toString());
        this.checkAuthorize(response.body.toString(), email);
      }, (err: HttpErrorResponse) => {
        if (err.status === 400) {
          console.log(err.error.message);
          this.alrt = err.error.message;
        }
    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.Login(this.registerForm.get('email').value, this.registerForm.get('password').value);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
}

   checkAuthorize(inputToken: string, userMail: string) {
    var obj = JSON.parse('{ "userEmail":""}');
    obj.userEmail = userMail;
    const _header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${inputToken}`
    });
    this.httpClient
      .post(API_URL + '/api/users/UserAccount', obj , { headers: _header })
      .subscribe((response: User) => {
        localStorage.setItem('ActiveUser', JSON.stringify(response));
        this.router.navigate(['/admin']);
      },(err: HttpErrorResponse) => {
        if (err.status === 400) {
          console.log(err.error.message); }
        this.alrt = err.error.message; }
      );
  }
}
