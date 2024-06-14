import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../_interface/constants';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  adminLoginAPi: string = `${API_URL}auth/admin_login`;
  uploadProfilePicAPI: string = `${API_URL}users/update_profile_pic/`;
  forgetPassAPI: string = `${API_URL}auth/admin_login`;

  httpOption: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'content-type': 'application/json' }),
  };
  login(
    email: string,
    password: string
  ): Observable<{
    data: any;
    token: string;
    status: number;
    message: any;
    responseCode: number;
  }> {
    return this.http.post<any>(
      this.adminLoginAPi,
      { email, password },
      this.httpOption
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('token');
    return authToken !== null ? true : false;
  }

  logout() {
    return this.http.post(`${API_URL}auth/logout`, {});
  }
}
