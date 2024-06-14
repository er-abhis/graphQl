import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { API_URL } from '../_interface/constants';
import {  valueType } from '../_interface/interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  private FetchUserAPI: string = `${API_URL}users/all_users`;
  private registerUserAPI: string = `${API_URL}auth/signup`;
  private ediUserApi: string = `${API_URL}users/update_user/`;
  private deletUserApi: string = `${API_URL}users/remove_user/`;
  private searchUserAPI: string = `${API_URL}users/search_user`;

  private getGomprehenciveListAPI: string = `${API_URL}comprensive/get_all_comprensive`;
  private addComprehenciveListAPI: string = `${API_URL}comprensive/add_comprensive`;
  private editComprehenciveListAPI: string = `${API_URL}comprensive/update_comprensive/`;
  deleteCompListAPI: any = `${API_URL}comprensive/delete_comprensive/`;

  private FetchRolesAPI: string = `${API_URL}roles/get_all_roles`;
  private addNewRoleAPI: string = `${API_URL}roles/add_role`;
  private editRoleAPI: string = `${API_URL}roles/update_role/`;

  private refreshHeader = new Subject<void>();
  refreshHeader$ = this.refreshHeader.asObservable();

  triggerRefresh() {
    this.refreshHeader.next();
  }

  getUsers(
    page: number,
    pageSize: number,
  ): Observable<{ data: any[]; pagination: any; id: any }> {
    return this.http.get<any>(this.FetchUserAPI, {
      params: new HttpParams()
        .set('limit', pageSize.toString())
        .set('page', page.toString()),
    });
  }

  registerUser(
    email: string,
    password: any,
    firstName: string,
    lastName: string,
    company: string,
    positions: string,
    aboutMe: string,
  ) {
    return this.http.post(this.registerUserAPI, {
      email,
      password,
      firstName,
      lastName,
      company,
      positions,
      aboutMe,
    });
  }

  updateUser(
    userId: number,
    firstName: string,
    lastName: string,
    company: string,
    positions: string,
    aboutMe: string,
  ) {
    return this.http.post(this.ediUserApi + userId + '?_method=PATCH', {
      firstName,
      lastName,
      company,
      positions,
      aboutMe,
    });
  }

  deleteUser(userId: number) {
    return this.http.delete<any>(this.deletUserApi + userId);
  }

  searchUser(
    search: string,
    page: number,
    pageSize: number,
  ): Observable<{ data: any[]; pagination: any; id: any; statusCode: number }> {
    return this.http.post<any>(this.searchUserAPI, {search}, {
      params: new HttpParams()
        .set('limit', pageSize.toString())
        .set('page', page.toString()),
    });
  }

  getComprehensiveList(
    page: number,
    pageSize: number,
  ): Observable<{ data: any[]; pagination: any; id: any }> {
    return this.http.get<any>(this.getGomprehenciveListAPI, {
      params: new HttpParams()
        .set('limit', pageSize.toString())
        .set('page', page.toString()),
    });
  }

  addComprehensiveList(name: string) {
    return this.http.post(this.addComprehenciveListAPI, { name });
  }

  editComprehensiveList(id: number, name: string) {
    return this.http.post(
      this.editComprehenciveListAPI + id + '?_method=PATCH',
      { name },
    );
  }
  deleteComprehensiveList(compId: valueType) {
    return this.http.delete<any>(this.deleteCompListAPI + compId);
  }
  
}
