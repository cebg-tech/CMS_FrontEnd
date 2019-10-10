import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Page } from '../../models/page';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {page: Page ;
  constructor(private httpClient: HttpClient) {
    this.page = null;
  }


  ngOnInit() {
    this.GetContent();
  }
  GetContent() {
    this.httpClient.get(API_URL + '/api/pages/getContact').subscribe((res: Page) => {this.page = res;

    });
  }
}

