import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { env } from '../_interface/constants';
import { PasswordStrengthValidator, trimValidator } from './login.validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private _loginService: LoginService
  ) {}
  loginForm!: FormGroup;
  evnVar: string = env;
  showPassword: boolean = false;
    ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        trimValidator(),
        this.validateDomain,
      ]),
      password: new FormControl(null, [
        Validators.maxLength(15),
        Validators.minLength(8),
        PasswordStrengthValidator,
        trimValidator(),
      ]),
    });
  }
  show(){
    this.showPassword= !this.showPassword;
    console.log(this.showPassword)
  }
  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');

    if (!emailControl) {
      return ''; // Return empty string if email control is not found
    }

    // Trim the email value before checking for errors
    const emailValue = emailControl.value ? emailControl.value.trim() : '';

    // Update the control value with the trimmed value
    emailControl.setValue(emailValue);

    // Manually update the control's validity status
    emailControl.updateValueAndValidity();

    const errors = emailControl.errors;

    if (!errors) {
      return '';
    }

    let errorMessage = '';

    switch (true) {
      case !!errors['required']:
        errorMessage = 'Email is required.';
        break;
      case !!errors['email']:
        errorMessage = 'Enter a valid email address.';
        break;

      case !!errors['invalidEmail']:
        errorMessage = ''; // No specific error message for invalid email after trimming
        break;
      case !!errors['invalidDomain']:
        errorMessage = 'Invalid domain name.';
        break;
      default:
        errorMessage = ''; // Default case if no error matches
        break;
    }

    return errorMessage;
  }

  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password');

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
        errorMessage = 'Password is required.';
        break;
      case !!errors['minlength']:
        errorMessage = `Password must be at least ${errors['minlength'].requiredLength} characters long.`;
        break;
      case !!errors['maxlength']:
        errorMessage = `Password cannot exceed ${errors['maxlength'].requiredLength} characters.`;
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

  onLogin() {
    if (this.loginForm.valid) {
      this._loginService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          (res) => {
            if (res.responseCode == 200) {
              this.router.navigate(['/admin/users']);
              localStorage.setItem('token', res.token);
              localStorage.setItem('adminData', JSON.stringify(res.data));
              this.toastr.success(res.message);
            }
          },
          (error) => {
            this.toastr.error(error.error?.message);
          }
        );
    }
  }

}
