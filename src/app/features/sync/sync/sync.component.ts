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

  syncDown() {
    this.syncService.syncDown();
  }

  syncUp() {
    this.syncService.syncUp();
  }
}
