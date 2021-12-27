import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfirmationDialogService } from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { SyncService } from '../sync.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent {
  constructor(
    private readonly syncService: SyncService,
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {}

  syncDown() {
    this.syncService.syncDown();
  }

  syncUp() {
    this.syncService.syncUp();
  }

  clearObjectStores() {
    this.confirmationDialogService
      .openConfirmationDialog(
        'Suppression des données locales',
        "Attention, les ventes enregistrées sur l'appareil et qui n'ont pas été envoyées au serveur seront définitivement perdues.",
      )
      .pipe(tap(() => this.syncService.clearObjectStores()))
      .subscribe();
  }
}
