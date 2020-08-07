import { IdbTransformable } from '../idb-transformable.model';

export interface BaseModel extends IdbTransformable {
  /** uuid of the object */
  id: string;
}
