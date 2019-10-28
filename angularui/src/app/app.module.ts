import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent} from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactComponent } from './components/contact/contact.component';
import { ExampleComponent } from './components/example/example.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AlertifyService } from './services/alertify.service';
import { PostComponent } from './components/post/post.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { PostFilterPipe } from './post-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent,
    AboutusComponent,
    ContactComponent,
    ExampleComponent,
    SafeHtmlPipe,
    PostComponent,
    PostFilterPipe
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxPaginationModule
  ],
  providers: [AlertifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
