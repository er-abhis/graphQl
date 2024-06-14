import { Component, ViewChild } from '@angular/core';
import { UiBasicModule } from 'src/app/component/ui-elements/ui-basic/ui-basic.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/_services/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fieald } from './userConst';
import Swal from 'sweetalert2';
import { API_URL } from 'src/app/_interface/constants';
import { debounceTime } from 'rxjs';
import { DataEntity, RolesEntity } from 'src/app/_interface/interface';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import {
  PasswordStrengthValidator,
  trimValidator,
} from 'src/app/login/login.validators';

@Component({
  selector: 'app-user-listing',
  standalone: true,
  imports: [SharedModule, UiBasicModule],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.scss',
})
export class UserListingComponent {
  @ViewChild('addUserModal') addUserModal: any;
  @ViewChild('ProfileModal') ProfileModal: any;

  allUsers: DataEntity[];
  limit: number;
  currentPage: number;
  totalItems: number;
  pazeSize: number;
  totalPage: any[];

  NoDataFound: boolean = false;
  addUserForm!: FormGroup;
  formSubmitted = false;
  searchUser!: FormGroup;
  activePage: number = 1;
  formFields = fieald;
  isEditMode: boolean = false;
  userId: number;
  userProfile: any;
  apiUrl = API_URL;

  constructor(
    private modalService: NgbModal,
    private _user: UsersService,
    private toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.fetchUsers(1, 10);
    this.addUserForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      email: new FormControl({ value: '', disabled: false }, [
        Validators.email,
        Validators.required,
        trimValidator(),
        this.validateDomain,
      ]),
      password: new FormControl('', [
        Validators.maxLength(15),
        Validators.minLength(8),
        PasswordStrengthValidator,
        trimValidator(),
      ]),
      company: new FormControl('', Validators.required),
      positions: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      aboutMe: new FormControl('', Validators.required),
      termsAndConditions: new FormControl(''),
    });
    this.searchUser = new FormGroup({
      userName: new FormControl(''),
    });

    this.searchUser
      .get('userName')
      .valueChanges.pipe(
        debounceTime(100), // Adjust debounce time as needed
      )
      .subscribe((value) => {
        if (!value?.trim()) {
          this.fetchUsers(1, 10);
        } else {
          this.findUser(1, 10);
        }
      });
  }
  getEmailErrorMessage() {
    const emailControl = this.addUserForm.get('email');

    if (!emailControl) {
      return '';
    }

    const emailValue = emailControl.value ? emailControl.value.trim() : '';

    emailControl.setValue(emailValue);

    emailControl.updateValueAndValidity();

    const errors = emailControl.errors;

    if (!errors) {
      return '';
    }

    let errorMessage = '';

    switch (true) {
      case !!errors['required']:
        errorMessage = 'Email is required';
        break;
      case !!errors['email']:
        errorMessage = 'Enter a valid email address';
        break;

      case !!errors['invalidEmail']:
        errorMessage = '';
        break;
      case !!errors['invalidDomain']:
        errorMessage = 'Invalid domain name';
        break;
      default:
        errorMessage = '';
        break;
    }

    return errorMessage;
  }
  validateDomain(control: FormControl): { [key: string]: boolean } | null {
    const email = control.value;
    if (email && email.indexOf('@') > -1) {
      const domain = email.split('@')[1];
      const allowedDomains = ['com', 'in', 'org']; // Add your allowed domain extensions here
      const domainExtension = domain.split('.').pop(); // Extract domain extension
      if (!allowedDomains.includes(domainExtension)) {
        return { invalidDomain: true };
      }
    }
    return null;
  }
  getPasswordErrorMessage() {
    const passwordControl = this.addUserForm.get('password');

    if (!passwordControl) {
      return ''; // Return empty string if password control is not found
    }

    const errors = passwordControl.errors;

    if (!errors) {
      return ''; // Return empty string if there are no errors
    }

    let errorMessage = '';

    switch (true) {
      case !!errors['required']:
        errorMessage = 'Password is required';
        break;
      case !!errors['minlength']:
        errorMessage = `Password must be at least ${errors['minlength'].requiredLength} characters long`;
        break;
      case !!errors['maxlength']:
        errorMessage = `Password cannot exceed ${errors['maxlength'].requiredLength} characters`;
        break;
      case !!errors['passwordStrength']:
        errorMessage = errors['passwordStrength'];
        break;

      default:
        errorMessage = '';
        break;
    }

    return errorMessage;
  }
  openAddUserModal() {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      centered: true,
    };

    this.modalService.open(this.addUserModal, modalOptions);
  }
  closeMoadal() {
    this.modalService.dismissAll();
    this.isEditMode = false;
    this.addUserForm.get('email')?.enable();
    this.addUserForm.get('password')?.enable();
    this.addUserForm.reset();
    this.formSubmitted = false;
  }
  viewProfileModal() {
    this.modalService.open(this.ProfileModal, { centered: true });
  }

  nextPage(): void {
    if (this.currentPage < this.pazeSize) {
      this.currentPage++;
      this.fetchUsers(this.currentPage, this.limit);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUsers(this.currentPage, this.limit);
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.activePage = page;
    this.fetchUsers(this.currentPage, this.limit);
  }

  flattenRoles(data: any) {
    data.forEach((data: any) => {
      delete data.createdAt;
      delete data.updatedAt;
      delete data.OTP;
      delete data.profile_pic;
      delete data.termsAndConditions;
    });

    const flattenedData = data.map((entry: any) => {
      const roles = entry.roles.map((role: any) => role.name);
      const compListing = entry.comprensive_listings.map(
        (val: any) => val.name,
      );
      return {
        ...entry,
        roles: roles.join(', '),
        comprensive_listings: compListing,
      };
    });
    return flattenedData;
  }

  downloadUsersAsCSV() {
    let count = 0;
    if (this.allUsers) {
      let allNewUser = JSON.parse(JSON.stringify(this.allUsers));
      delete allNewUser[0];
      delete allNewUser[1];

      allNewUser.shift();

      let header: any =
        'id,First Name,Last Name,Email,Company,Position,About,Status,Verified,Roles';

      for (let i = 0; i < this.allUsers.length; i++) {
        if (count == 10) {
          break;
        }
        if (this.allUsers[i].comprensive_listings.length > count) {
          count = this.allUsers[i].comprensive_listings.length;
        }
      }
      for (let i = 0; i < count; i++) {
        header = header.concat(`,Preference ${i + 1}`);
      }

      const csv = this.flattenRoles(allNewUser)
        .map((row: any) => {
          return Object.values(row).join(',');
        })
        .join('\n');
      const csvData = header + csv;
      const blob = new Blob([csvData], { type: 'text/csv' });
      saveAs(blob, 'users.csv');
    }
  }
  findUser(page: number, pageSize: number) {
    console.log('adjfbj', page, pageSize);
    this._user
      .searchUser(this.searchUser.value.userName, page, pageSize)
      .subscribe(
        (res) => {
          console.log(res.statusCode, 'adlkjh');
          if (res.statusCode == 400) {
            // this.NoDataFound = true;
            this.allUsers = null;
          } else {
            this.allUsers = res.data;
            this.totalItems = res.pagination?.totalItems;
            this.currentPage = res.pagination?.currentPage;
            this.limit = res.pagination?.limit;
            this.pazeSize = res.pagination?.totalpage;

            this.totalPage = Array.from(
              { length: this.pazeSize },
              (_, i) => i + 1,
            );
          }
        },
        (err) => {
          this.toastr.error(err.error?.message);
        },
      );
  }
  clearSearchForm() {
    this.searchUser.get('userName').setValue('');
    this.fetchUsers(this.currentPage, this.limit);
  }
  fetchUsers(page: number, pageSize: number) {
    console.log('adjfbj', page, pageSize);
    this._user.getUsers(page, pageSize).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.allUsers = res.data;
          this.totalItems = res.pagination?.totalItems;
          this.currentPage = res.pagination?.currentPage;
          this.limit = res.pagination?.limit;
          this.pazeSize = res.pagination?.totalpage;

          this.totalPage = Array.from(
            { length: this.pazeSize },
            (_, i) => i + 1,
          );
        }
      },
      (err) => {
        this.toastr.error(err.error?.message);
      },
    );
  }

  editUser(user: DataEntity) {
    this.isEditMode = true;
    console.log('editMode', this.isEditMode);
    this.openAddUserModal();
    this.addUserForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName,
      email: user.email,
      company: user.company,
      positions: user.positions,
      aboutMe: user.aboutMe,
    });
    this.addUserForm.get('email')?.disable();
    this.addUserForm.get('password')?.disable();

    this.userId = user.id;
  }

  saveUser() {
    this.formSubmitted = true;
    if (this.addUserForm.valid) {
      let firstName = this.addUserForm.value.firstName;
      let lastName = this.addUserForm.value.lastName;
      let company = this.addUserForm.value.company;
      let positions = this.addUserForm.value.positions;
      const email = this.addUserForm.value.email;
      const password = this.addUserForm.value.password;
      let aboutMe = this.addUserForm.value.aboutMe;

      firstName = this.capitalizeFirstLetter(firstName);
      lastName = this.capitalizeFirstLetter(lastName);
      company = this.capitalizeFirstLetter(company);
      positions = this.capitalizeFirstLetter(positions);
      aboutMe = this.capitalizeFirstLetter(aboutMe);

      if (this.isEditMode) {
        console.log('edited');
        // Update user
        this._user
          .updateUser(
            this.userId,
            firstName,
            lastName,
            company,
            positions,
            aboutMe,
          )
          .subscribe(
            (res: any) => {
              if (res.statusCode == 200) {
                this.closeMoadal();
                this.fetchUsers(this.currentPage, this.limit);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            },
            (err) => {
              this.toastr.error(err.error?.message);
            },
          );
      } else {
        // Register new user
        this._user
          .registerUser(
            email,
            password,
            firstName,
            lastName,
            company,
            positions,
            aboutMe,
          )
          .subscribe(
            (res: any) => {
              if (res.statusCode == 200) {
                this.closeMoadal();
                this.fetchUsers(this.currentPage, this.limit);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
              } else if (res.statusCode == 400) {
                this.closeMoadal();
                this.toastr.error(res?.message);
              }
            },
            (err) => {
              this.toastr.error(err.error?.message);
            },
          );
      }
    }
  }
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  deleteUser(userId: number, userRole: RolesEntity) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (
            userRole[0].name != 'Admin' &&
            userRole[0].name != 'Super Admin'
          ) {
            this._user.deleteUser(userId).subscribe(
              (res: any) => {
                if (res.statusCode == 200) {
                  swalWithBootstrapButtons.fire({
                    title: 'Deleted!',
                    text: 'User deleted',
                    icon: 'success',
                    timer: 2000,
                  });
                  this.fetchUsers(this.currentPage, this.limit);
                }
              },
              (err) => {
                this.toastr.error(err.error?.message);
              },
            );
          } else {
            swalWithBootstrapButtons.fire({
              title: "Admin can't be deleted",
              icon: 'error',
              timer: 1500,
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled ',
            icon: 'error',
            timer: 1500,
          });
        }
      });
  }

  viewUser(user: DataEntity) {
    this.viewProfileModal();
    this.userProfile = user;
    console.log(this.userProfile.profile_pic, 'fsdfs');
    console.log(this.apiUrl);
  }
  getColorClass(index: number): string {
    const colors = ['bg-danger', 'bg-warning', 'bg-success', 'bg-primary'];
    return colors[index % colors.length];
  }
}
