import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyApiService {
  username = localStorage.getItem('username');
  password = localStorage.getItem('password');
  auth = btoa(`${this.username}:${this.password}`);
  data: {
    uname,
    role
  }
  private apiUrl = 'http://192.168.2.24:8080/jasper';
  constructor(private http: HttpClient) {
  }
  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.apiUrl + "/download"}/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getAllDesign() {
    const url = `${this.apiUrl + "/getAll"}`;
    return this.http.get(url)
  }
  generateReport(obj: any) {
    const url = `${this.apiUrl}/generate`;
    return this.http.post<any>(url, obj);
  }
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('role', localStorage.getItem('role'));
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

  }
  // authenticate(input: any) {
  //   const url = `${this.apiUrl + "/login"}`;
  //    this.http.post(url, input).subscribe(
  //     (res: any) => {
  //       console.log(res);
  //     }
  //   )
  // }
  authenticate(input: any): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<any>(url, input);
  }
  sendForApproval(input: any): Observable<any> {
    const url = `${this.apiUrl}/sendForApproval`;
    return this.http.post<any>(url, input);
  }
  isApprove(id: number, input: any): Observable<any> {
    const obj = {
      id: id,
      isApprove: input
    };
    const url = `${this.apiUrl}/approval`;
    return this.http.post<any>(url, obj);
  }
}
