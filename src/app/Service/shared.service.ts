import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class SharedService {
 
  constructor() { }
 
  private changeLoginSubject = new Subject<void>();
  changeLogin$ = this.changeLoginSubject.asObservable();

  private loginStatusSubject = new BehaviorSubject<void>(undefined);
  loginStatus$ = this.loginStatusSubject.asObservable();

  triggerChangeLogin() {
    this.loginStatusSubject.next(undefined);
  }
 
}