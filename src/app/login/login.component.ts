import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyApiService } from '../service/my-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: { uname: string; password: string } = { uname: '', password: '' };
  loginError: string | null = null;

  constructor(private router: Router, private apiService: MyApiService) { }

  onSubmit() {
    this.apiService.authenticate(this.loginObj).subscribe(
      (res: any) => {
        if (res) {
          localStorage.setItem('role', res.role);
          localStorage.setItem('username',this.loginObj.uname);
          localStorage.setItem('password',this.loginObj.password);
          this.router.navigate(['/report']);
        } else {
          this.loginError = 'Invalid userId or password';
        }
      },
      error => {
        // Handle error response
        this.loginError = 'Invalid userId or password';
        console.error('Authentication failed', error);
      }
    );
  }
}
