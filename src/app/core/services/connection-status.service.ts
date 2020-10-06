import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionStatusService {
  public status$: Observable<boolean>;

  private readonly status: BehaviorSubject<boolean> = new BehaviorSubject(navigator.onLine);
  private _connectionStatus: string = navigator.onLine ? 'online' : 'offline';

  constructor() {
    this.status$ = this.status.asObservable();
  }

  set connectionStatus(connectionStatus: string) {
    this._connectionStatus = connectionStatus;
    this.status.next(this.isOnline());
  }

  get connectionStatus() {
    return this._connectionStatus;
  }

  public isOnline() {
    return this.connectionStatus === 'online';
  }
}
