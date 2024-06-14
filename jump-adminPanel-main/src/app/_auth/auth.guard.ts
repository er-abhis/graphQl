import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../_services/login.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class authGuard {
  constructor(public authService: LoginService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // if (this.authService.isLoggedIn !== true) {
    //   this.router.navigate(['']);
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Access Denied!...',
    //     timer: 2000,
    //     showConfirmButton: false,
    //   });
    // }
    return true;
  }
}
