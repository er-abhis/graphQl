import { Directive, HostListener } from '@angular/core';
@Directive({
  selector: '[tbOnlyCharacter]'
})
export class OnlyCharacterDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ([46, 8, 9, 27, 13, 110, 190, 32].indexOf(event.keyCode) !== -1 ||
      (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }
    if (!event.key.match(/[a-zA-Z]/)) {
      event.preventDefault();
    }
  }

}
