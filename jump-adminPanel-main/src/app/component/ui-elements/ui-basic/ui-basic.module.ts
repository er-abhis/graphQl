import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiBasicRoutingModule } from './ui-basic-routing.module';
import { ActionIconsComponent } from './action-icons/action-icons.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, UiBasicRoutingModule,ActionIconsComponent],
  exports:[ActionIconsComponent]
})
export class UiBasicModule {}
