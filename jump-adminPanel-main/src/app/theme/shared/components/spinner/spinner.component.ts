import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/_services/loader.service';
import { Spinkit } from './spinkits';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss', './spinkit-css/sk-line-material.scss'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  public isSpinnerVisible = false;
  public Spinkit = Spinkit;

  @Input() public backgroundColor = '#1dc4e9';
  @Input() public spinner = Spinkit.skLine;

  private loaderSubscription: Subscription;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderSubscription = this.loaderService.isLoading.subscribe(
      (isLoading) => {
        this.isSpinnerVisible = isLoading;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
