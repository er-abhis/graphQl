import { Component } from '@angular/core';
import { env } from 'src/app/_interface/constants';

@Component({
  selector: 'app-nodata-found',
  standalone: true,
  imports: [],
  templateUrl: './nodata-found.component.html',
  styleUrl: './nodata-found.component.scss'
})
export class NodataFoundComponent {
envVar:string=env;
}
