import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormspreeService {
  constructor(private readonly httpClient: HttpClient) {}

  log(error: unknown, data: unknown) {
    return this.httpClient.post('https://formspree.io/f/xoqzakpn', {
      name: 'Thibaut Virolle',
      email: 'thibaut.virolle@protonmail.com',
      message: { error, data },
    });
  }
}
