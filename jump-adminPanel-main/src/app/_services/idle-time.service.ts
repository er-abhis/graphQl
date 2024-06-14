import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  fromEvent,
  map,
  mergeMap,
  startWith,
  timer,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdleTImeService {
  public lastActivitySubject = new BehaviorSubject<number>(Date.now());
  lastActivity$ = this.lastActivitySubject.asObservable();

  idleTime$: Observable<number>;

  constructor() {
    const activity$ = fromEvent(document, 'mousemove').pipe(
      mergeMap(() => timer(0)),
      startWith(0)
    );

    this.idleTime$ = activity$.pipe(
      map(() => Date.now() - this.lastActivitySubject.value)
    );

    activity$.subscribe(() => {
      this.lastActivitySubject.next(Date.now());
    });
  }
  resetIdleTime() {
    this.lastActivitySubject.next(Date.now());
  }
}
