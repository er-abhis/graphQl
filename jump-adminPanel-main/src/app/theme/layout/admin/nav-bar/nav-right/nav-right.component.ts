// angular import
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { API_URL } from 'src/app/_interface/constants';
import { IdleTImeService } from 'src/app/_services/idle-time.service';
import { LoginService } from 'src/app/_services/login.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent {
  liveIdleTime: number = 0;
  liveSecond: number = 0;
  private timerSubscription: Subscription;
  private swalAlert: any; // Store reference to the SweetAlert
  adminProfileData: any;
  apiUrl: any = API_URL;
  constructor(
    private router: Router,
    private idleService: IdleTImeService,
    private logout: LoginService,
    private _toster: ToastrService,
    private _user: UsersService,
  ) {
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      const millisecondsSinceLastActivity =
        Date.now() - this.idleService.lastActivitySubject.value;
      const totalSeconds = millisecondsSinceLastActivity / 1000;
      this.liveIdleTime = Math.floor(totalSeconds / 60);
      this.liveSecond = Math.floor(totalSeconds);

      if (this.liveSecond === 14 * 60 && !this.swalAlert) {
        this.swalAlert = Swal.fire({
          position: 'center',
          title: 'Warning!',
          text: `Your session will logout in ${
            60 - (this.liveSecond - this.liveIdleTime * 60)
          } minute.`,
          showConfirmButton: false,
          timer: 59000,
        });
      }
      if (this.liveSecond == 0 && this.swalAlert) {
        this.closeAlert(); // Call the closeAlert method to close the alert
      }
      if (this.liveIdleTime == 15) {
        this.onLogout();
      }
    });
  }
  private headerRefreshSubscription: Subscription;

  ngOnInit() {
    // this.adminProfileData = JSON.parse(localStorage.getItem('adminData')!);
    this.headerRefreshSubscription = this._user.refreshHeader$.subscribe(() => {
      this.ngOnInit();
    });
  }

  closeAlert() {
    if (this.swalAlert) {
      this.swalAlert.close();
      this.swalAlert = null; // Reset swalAlert reference
    }
  }

  onLogout() {
    this.logout.logout().subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.timerSubscription.unsubscribe(); // Unsubscribe timer to stop further execution
          this.router.navigate(['']);
          this._toster.success(res.message);
          localStorage.removeItem('medcalPractice');
          localStorage.removeItem('adminData');
          localStorage.removeItem('token');
          localStorage.removeItem('userdata');
        }
      },
      (error) => {
        this._toster.error(error.error.message);
      },
    );
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }
}
