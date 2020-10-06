import { ActivatedRoute, ParamMap, UrlSegment, Params, Data, convertToParamMap } from '@angular/router';
import { MockOfActivatedRouteSnapshot } from './activated-route-snapshot.mock';
import { Observable, of } from 'rxjs';

/**
 * This mock of ActivatedRouteSnapshot is usefull for unit testing components where params
 * comes from a parent or an ancestor.
 * Using the constructor and the param 'depth', you could set how many ancestors you need.
 */
export class MockOfActivatedRoute implements ActivatedRoute {
  url = new Observable<UrlSegment[]>();
  params = new Observable<Params>();
  queryParams = new Observable<Params>();
  queryParamMap = new Observable<ParamMap>();
  fragment = new Observable<string>();
  data = new Observable<Data>();
  outlet: '';
  component: '';
  root: ActivatedRoute;
  routeConfig: {};
  parent: MockOfActivatedRoute;
  firstChild: ActivatedRoute;
  paramMap = new Observable<ParamMap>();
  children: [ActivatedRoute];
  pathFromRoot: [ActivatedRoute];
  snapshot: MockOfActivatedRouteSnapshot;

  constructor(depth: number = 1, paramMap?: {[key: string]: any}) {
    if (depth > 0) {
      this.parent = new MockOfActivatedRoute(depth - 1);
    }
    if (paramMap) {
      this.paramMap = of(convertToParamMap(paramMap));
    }
  }
}
