import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';
import { IArticle } from 'src/app/models/IArticle';
import {MyUploadAdapter} from '../../helpers/MyUploader'

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit {
  public Editor = ClassicEditor;
  editorConfig = {
    placeholder: 'Type the content here!'
  };
  article: IArticle;

  constructor(private router: Router) {
    this.article = {
      title: '',
      text: '',
    };
  }

  onReady($event) {
    $event.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  ngOnInit() {}

  onSubmit() {
    this.router.navigate(['/view'], { state: this.article});
  }

}
