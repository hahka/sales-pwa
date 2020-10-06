import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ConnectionStatusService } from './core/services/connection-status.service';
import { SyncService } from './features/sync/sync.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sales-pwa-app';
  public onlineEvent: Observable<Event>;
  public offlineEvent: Observable<Event>;
  public subscriptions: Subscription[] = [];

  constructor(
    public readonly connectionStatusService: ConnectionStatusService,
    public readonly syncService: SyncService,
  ) {}

  ngOnInit(): void {
    if (navigator.onLine) {
      this.syncService.checkIfSynchronizationIsNeeded();
    }
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.subscriptions.push(
      this.onlineEvent.subscribe((_) => {
        this.connectionStatusService.connectionStatus = 'online';
        this.syncService.checkIfSynchronizationIsNeeded();
      }),
    );
    this.subscriptions.push(
      this.offlineEvent.subscribe((_) => {
        this.connectionStatusService.connectionStatus = 'offline';
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) sub.unsubscribe();
    });
  }
}
