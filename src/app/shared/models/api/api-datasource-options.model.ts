import { Sort } from '../../../core/services/api';
import { BaseModel } from './base.model';
import { SearchDto } from './search-dto.model';

export class ApiDataSourceOptions<T extends BaseModel> {
  initialQuery: SearchDto;
  initialSort?: Sort<T>;
}
