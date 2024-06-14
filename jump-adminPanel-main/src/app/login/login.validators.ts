import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PasswordStrengthValidator = function (
  control: AbstractControl
): ValidationErrors | null {
  let value: string = control.value || '';
  let msg = '';
  if (!value) {
    return null;
  }

  let upperCaseCharacters = /[A-Z]+/g;
  let lowerCaseCharacters = /[a-z]+/g;
  let numberCharacters = /[0-9]+/g;
  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (upperCaseCharacters.test(value) === false) {
    return {
      passwordStrength: 'Password must contain one uppercase character!',
    };
  } else if (lowerCaseCharacters.test(value) === false) {
    return {
      passwordStrength: 'Password must be contain one lowecase character!',
    };
  } else if (numberCharacters.test(value) === false) {
    return {
      passwordStrength: 'Password must be contain numbers!',
    };
  } else if (specialCharacters.test(value) === false) {
    return {
      passwordStrength:
        'Password must be contain atleast one special character!',
    };
  }
  return null;
};

export function trimValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // Check if the value is a string and non-empty
    if (typeof value === 'string' && value.trim() !== value) {
      // Trim leading and trailing whitespace
      const trimmedValue = value.trim();

      // Update the control value if it was changed
      control.setValue(trimmedValue); // Set the trimmed value back to the control

      // Return a validation error indicating trimming occurred (optional)
      return { trimmed: true };
    }

    return null; // Return null if no trimming occurred
  };
}
