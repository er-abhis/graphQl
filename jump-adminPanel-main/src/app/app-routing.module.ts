import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './_auth/auth.guard';
import { AdminProfileComponent } from './theme/layout/admin/nav-bar/admin-profile/admin-profile.component';
import { NoPageFoundComponent } from './theme/shared/components/no-page-found/no-page-found.component';

const routes: Routes = [
  {
    path: '',
    // component: LoginComponent,
    component: AdminComponent,
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./component/pages/tables/tables.module').then(
            (m) => m.TablesModule,
          ),
      },
      {
        path: 'profile',
        component:AdminProfileComponent,
        title:"admin_profile"
      }
    ],
  },
  {
    path:"**",
    component:NoPageFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
