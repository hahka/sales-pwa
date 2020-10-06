import { BaseModel } from './api/base.model';

export class Market implements BaseModel {
  id?: string;
  name: string;

  constructor(obj?: Market) {
    Object.assign(this, obj);
  }

  prepareForIdb() {
    return {
      ...this,
      nameSortable: this.name.toUpperCase(),
    };
  }
}
