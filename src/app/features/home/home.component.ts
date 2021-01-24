import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/utils/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /** Width of the grid */
  responsiveCols = 3;

  buttons = [
    { label: 'Gestion des Marchés', routerLink: AppRoutes.MARKETS_ADMIN },
    { label: 'Gestion des Produits', routerLink: AppRoutes.PRODUCTS_ADMIN },
    { label: 'Stock', routerLink: AppRoutes.PRODUCE },
    { label: 'Préparation de marché', routerLink: AppRoutes.MARKET_PREPARATION },
    { label: 'Marché', routerLink: AppRoutes.SALE },
    { label: 'Synchronisation', routerLink: AppRoutes.SYNC },
  ];

  private readonly tileSize = 200;

  ngOnInit(): void {
    this.responsiveCols = Math.trunc(window.innerWidth / this.tileSize);
  }

  /** Handle Resizing */
  onResize(event: any): void {
    this.responsiveCols = Math.trunc(event.target.innerWidth / this.tileSize);
  }
}
