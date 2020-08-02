import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionStatusService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject(navigator.onLine);
  private _connectionStatus: string = navigator.onLine ? 'online' : 'offline';

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
