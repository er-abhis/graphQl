import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { UiBasicModule } from '../../ui-elements/ui-basic/ui-basic.module';


@NgModule({
  declarations: [],
  imports: [CommonModule, TablesRoutingModule,UiBasicModule],
})
export class TablesModule {}
