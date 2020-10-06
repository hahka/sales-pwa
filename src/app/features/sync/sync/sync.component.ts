import { Component, OnInit } from '@angular/core';
import { SyncService } from '../sync.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent implements OnInit {
  constructor(private readonly syncService: SyncService) {}

  ngOnInit(): void {}

  synchronize() {
    this.syncService.syncDown();
    this.syncService.syncUp();
  }
}
