import { Sort } from '../../../core/services/api';
import { SearchDto } from './search-dto.model';

export class ApiDataSourceOptions<T> {
  initialQuery: SearchDto;
  initialSort?: Sort<T>;
}
