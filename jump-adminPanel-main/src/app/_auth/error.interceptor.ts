import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private _logout: LoginService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (error) => {
          if (error.status >= 400) {
            // this.logout();
            return ;
          }
        }
      )
    );
  }
  logout() {
    localStorage.removeItem('adminData');
    localStorage.removeItem('token');
    localStorage.removeItem('userdata');
    this._logout.logout();
    this.router.navigate(['']);
  }
}
