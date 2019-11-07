
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Observable, merge, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  styleUrls: ['example.component.css'],
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  displayedColumns2: string[] = ['internalId', 'userEmail', 'userCreated'];
  dataSource: MatTableDataSource<UserData>;
  public ds = new MatTableDataSource<User>();
  exampleDatabase: ExampleHttpDatabase | null;
  data: User[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private httpClient: HttpClient) {
    // Create 10 users
    const users = Array.from({ length: 10 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  ngAfterViewInit() {
  }

  ngOnInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this.httpClient);
    this.exampleDatabase.getUsers().subscribe(res => {
      this.ds.data = res as User[];
    });
    this.ds.paginator = this.paginator;
    this.ds.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public doFilter = (value: string) => {
    this.ds.filter = value.trim().toLocaleLowerCase();
    if (this.dataSource.paginator) {
      this.ds.paginator.firstPage();
    }
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}


export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) { }

  getUsers() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('CMS_Token')}`
    });
    return this._httpClient.get('http://localhost:55315/api/users/GetAll', { headers: header });
  }
}
