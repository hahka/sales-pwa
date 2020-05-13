import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PageHeaderAction } from './page-header-action.enum';
import { PageHeaderEvent } from './page-header-event.interface';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  /** FormControl/FormGroup of the page, used to know if in edit mode or readonly */
  @Input() control: AbstractControl;

  /** To disable validation (mainly if form is invalid) */
  @Input() disableValidate: boolean;

  /** Wether the back button should be displayed */
  @Input() displayBack = true;

  /** Wether the unarchiving is allowed */
  @Input() canUnarchive = false;

  /** Wether the object is archived, to know which buttons display */
  @Input() isArchived = false;

  /** Wether The header is user for lists */
  @Input() forList = false;

  /** For use in template */
  PageHeaderAction = PageHeaderAction;

  /** Event when the user clicks on a button */
  @Output() pageHeaderEvent = new EventEmitter<PageHeaderEvent>();

  /** Title to be displayed in the header */
  @Input() title: string;

  /** Wether modifications are being made on the form */
  get readonly(): boolean {
    return this.control ? this.control.disabled : false;
  }

  /** Wether buttons on the upper right corner should be displayed, mainly if in edit mode */
  get displayCrudBtn(): boolean {
    if (!this.control) {
      return false;
    }

    return true;
  }

  get displayArchive(): boolean {
    if (!this.displayCrudBtn) {
      return false;
    }
    if (this.isArchived && !this.canUnarchive) {
      return false;
    }

    const id = this.control.get('_id');

    return id && id.value;
  }
  /** Handles the buttons' click event */
  onClick(event: PageHeaderAction): void {
    if ((event === PageHeaderAction.BACK || event === PageHeaderAction.CANCEL) && !this.readonly) {
      // TODO: prevent user via popup
      this.pageHeaderEvent.emit({ action: event });
    } else {
      this.pageHeaderEvent.emit({ action: event });
    }
  }
}
