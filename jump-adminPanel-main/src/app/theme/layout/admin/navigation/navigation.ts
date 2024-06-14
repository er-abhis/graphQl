import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'forms',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      // {
      //   id: 'users',
      //   title: 'Users',
      //   type: 'item',
      //   url: '/admin/users',
      //   classes: 'nav-item',
      //   icon: 'feather icon-users',
      // },
       {
        id: 'products',
        title: 'Products',
        type: 'item',
        url: '/admin/products',
        classes: 'nav-item',
        icon: 'feather icon-users',
      },
      // {
      //   id: 'preferences',
      //   title: 'Preferences',
      //   type: 'item',
      //   url: '/admin/preferences',
      //   classes: 'nav-item',
      //   icon: 'feather icon-sliders',
      // },
    ],
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
