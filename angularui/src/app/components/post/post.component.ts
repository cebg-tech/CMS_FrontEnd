import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Post } from '../../models/post';
import { AlertifyService } from 'src/app/services/alertify.service';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  today = new Date();

  constructor(
    private httpClient: HttpClient,
    private alertify: AlertifyService
  ) { }

  posts: Post[] = [];
  selectedPost: Post = new Post();
  pageOfItems: Array<any>;

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts() {
    this.httpClient.get(API_URL + '/api/posts/getposts').subscribe(
      (response: Post[]) => {
        this.posts = response.filter(post => post.postState === 'Published');
      },
      (err: HttpErrorResponse) => {
        this.alertify.error(err.message);
      }
    );
  }

  getPostContent(id: string) {
    this.selectedPost = this.posts.filter(post => post.internalId === id)[0];
  }

  onChangePage(pageOfItems) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
}
