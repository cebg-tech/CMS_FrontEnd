import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactComponent } from './components/contact/contact.component';
import { ExampleComponent } from './components/example/example.component';
import { PostComponent } from './components/post/post.component';


const routes: Routes = [{ path: '', component: DashboardComponent},
                        { path: 'admin', component: AdminComponent},
                        { path: 'login', component: LoginComponent},
                        { path: 'aboutus', component: AboutusComponent},
                        { path: 'contact', component: ContactComponent},
                        { path: 'exm', component: ExampleComponent},
                        { path: 'post', component: PostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
