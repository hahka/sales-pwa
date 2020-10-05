import { IdbStoresEnum } from '../../../utils/enums';
import { EnvironmentService } from '../environment/environment.service';

/**
 * This class aims to ease generating api resource's url,
 * mainly because IDB store's names are camel case and api's urls are kebab case.
 */
export abstract class ResourceUrlHelper {
  abstract resource: IdbStoresEnum;

  constructor(protected readonly environmentService: EnvironmentService) {}

  /**
   * Returns the kebab case formatted url.
   */
  getFormattedUrl() {
    return (
      this.environmentService.apiUrl + this.resource.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    );
  }
}
