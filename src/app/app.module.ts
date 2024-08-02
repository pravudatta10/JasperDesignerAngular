import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MyApiService } from './service/my-api.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RemoveExtensionPipe } from './pipes/remove-extension.pipe';
import { LoginComponent } from './login/login.component'
import { FormsModule } from '@angular/forms';
import { ReportComponent } from './report/report.component';
import { RouterModule, Routes } from '@angular/router';
import { RequestHandlerInterceptor } from './interceptor/request-handler.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    RemoveExtensionPipe,
    LoginComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes)
  ],
  providers: [MyApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestHandlerInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy, 
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
