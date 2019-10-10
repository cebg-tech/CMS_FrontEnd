import { Component, OnInit } from '@angular/core';
import { MustMatch } from '../../helpers/must-match.validator';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';




@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    formGroup = this.fb.group({
      file: [null, Validators.required]
    });
    binaryString: string;

constructor(private formBuilder: FormBuilder, private fb: FormBuilder) { }

ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
  }, {
      validator: MustMatch('password', 'confirmPassword')
  });
  }
  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
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
    this.binaryString = event.target.result;
    this.binaryString = btoa(this.binaryString);
    console.log(this.binaryString);
   }
}

