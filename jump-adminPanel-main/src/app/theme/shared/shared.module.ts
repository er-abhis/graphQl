// angular import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { CardComponent } from './components/card/card.component';

// bootstrap import
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ActiveSidenavComponent } from './components/active-sidenav/active-sidenav.component';
import { NodataFoundComponent } from './components/nodata-found/nodata-found.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SingleSpaceDirective } from './directives/single-space.directive';
import { OnlyCharacterDirective } from './directives/only-character.directive';
import { PaginatorComponent } from './components/paginator/paginator.component';

const COMPONENT = [
  SpinnerComponent,
  SingleSpaceDirective,
  OnlyCharacterDirective,
]

@NgModule({
  declarations: [ ...COMPONENT,],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbModule,
    NgScrollbarModule,
    NgbCollapseModule,
    ActiveSidenavComponent,
    NodataFoundComponent,
    PaginatorComponent

  ],
  exports: [
    ...COMPONENT,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbModule,
    NgScrollbarModule,
    NgbCollapseModule,
    CardComponent,
    ActiveSidenavComponent,
    NodataFoundComponent,
    PaginatorComponent

  ],
})
export class SharedModule {}
