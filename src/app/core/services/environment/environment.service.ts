import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  /**
   * Getter for the api url
   */
  public get apiUrl(): string | undefined {
    return environment.api_uri;
  }
}
