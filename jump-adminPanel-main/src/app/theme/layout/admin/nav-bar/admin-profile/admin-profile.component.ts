import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { API_URL } from 'src/app/_interface/constants';
import { LoginService } from 'src/app/_services/login.service';
import { UsersService } from 'src/app/_services/users.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CardComponent,CommonModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss'
})
export class AdminProfileComponent {
  constructor(private _loginService: LoginService,private _user:UsersService, private http: HttpClient) {}
  fileName: string = '';
  adminProfileData: any;
  apiUrl: any = API_URL;
  
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  ngOnInit() {
    this.adminProfileData = JSON.parse(localStorage.getItem('adminData')!);
  
  }
  onEditIconClick() {
    // Trigger click on the file input element
    this.fileUpload.nativeElement.click();
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
console.log(event,'profile');
    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('profile_pic', file);

      const upload$ = this.http
        .patch<any>(
          `${API_URL}users/update_profile_pic/${this.adminProfileData[0].id}`,
          formData
        )
        .subscribe((res) => {
          let newData: any = this.adminProfileData.map((item: any) => ({
            ...item,
            profile_pic: res.data,
          }));
          localStorage.setItem('adminData', JSON.stringify(newData));
          this.ngOnInit();

        this._user.triggerRefresh();
        });
    }
  }
}
