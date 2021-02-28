import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, tap } from 'rxjs/operators';
import { SyncService } from '../sync.service';
import { ClearObjectStoresWarningDialogComponent } from './clear-object-stores-warning-dialog/clear-object-stores-warning-dialog.component';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent implements OnInit {
  constructor(private readonly syncService: SyncService, private readonly matDialog: MatDialog) {}

  ngOnInit(): void {}

  syncDown() {
    this.syncService.syncDown();
  }

  syncUp() {
    this.syncService.syncUp();
  }

  clearObjectStores() {
    this.matDialog
      .open<ClearObjectStoresWarningDialogComponent, boolean>(
        ClearObjectStoresWarningDialogComponent,
      )
      .afterClosed()
      .pipe(
        filter((response) => !!response),
        tap(() => this.syncService.clearObjectStores()),
      )
      .subscribe();
  }
}
