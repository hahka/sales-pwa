import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConnectionStatusService {
  private _connectionStatus: string = navigator.onLine ? 'online' : 'offline';

  set connectionStatus(connectionStatus: string) {
    this._connectionStatus = connectionStatus;
  }

  get connectionStatus() {
    return this._connectionStatus;
  }

  public isOnline() {
    return this.connectionStatus === 'online';
  }
}
