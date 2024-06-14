import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-action-icons',
  standalone: true,
  imports: [],
  templateUrl: './action-icons.component.html',
  styleUrl: './action-icons.component.scss'
})
export class ActionIconsComponent {
 // Input properties to receive functions from parent component
 @Input() onEdit: Function;
 @Input() onDelete: Function;
 @Input() onView: Function;

 @Input() viewIcon: boolean = true;
  constructor() { }

 // Functions to trigger parent component functions
 edit() {
   if (this.onEdit) {
     this.onEdit();
     }
 }

 delete() {
     if (this.onDelete) {
         this.onDelete();
     }
 }

 view() {
     if (this.onView) {
         this.onView();
     }
 }
}
