import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[tbSingleSpace]'
})
export class SingleSpaceDirective {

  timeout: any = null;
  constructor() {
   }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let inputValue: string = event.target.value;
    inputValue = inputValue.trimLeft();
    const sanitizedValue = inputValue.replace(/\s+/g, ' '); // Replace consecutive white spaces with a single space
    event.target.value = sanitizedValue;
    //BELLOW CODE FOR REMOVE EXTRA LAST SPACE AFTER USER WRITING DONE.
    clearTimeout(this.timeout);
    var data = event.target.value;
    var $this = this;
    if (data.length > 0) {
      this.timeout = setTimeout(function () {
        if (event.keyCode != 13) {
          event.target.value = sanitizedValue.trim()
        }
      }, 1000);
    }
  }

}
