import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { env } from 'src/app/_interface/constants';

@Component({
  selector: 'app-no-page-found',
  standalone: true,
  imports: [],
  templateUrl: './no-page-found.component.html',
  styleUrl: './no-page-found.component.scss'
})
export class NoPageFoundComponent {
  noPageImg:string=env;
constructor(private  router:Router){}
  BacktoLogin(){
    this.router.navigate(['']);

  }
}
