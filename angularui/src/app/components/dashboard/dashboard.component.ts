import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Page } from '../../models/page';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  page: Page ;
  constructor(private httpClient: HttpClient) {
    this.page = null;
  }


  ngOnInit() {
    this.GetContent();
  }
  GetContent() {
    this.httpClient.get(API_URL + '/api/pages/getIndex').subscribe((res: Page) => {this.page = res;

    });
  }
}


