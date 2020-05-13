import { PageHeaderAction } from './page-header-action.enum';

export interface PageHeaderEvent {
  /** Value corresponding to the user click action (cancel, save, back...) */
  action: PageHeaderAction;
}
