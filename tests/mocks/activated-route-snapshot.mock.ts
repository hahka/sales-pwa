import { ActivatedRouteSnapshot, ParamMap } from '@angular/router';

/**
 * This mock of ActivatedRouteSnapshot is usefull for unit testing components where params
 * comes from a parent or an ancestor.
 * Using the constructor and the param 'depth', you could set how many ancestors you need.
 */
export class MockOfActivatedRouteSnapshot implements ActivatedRouteSnapshot {
  url = [];
  params = [];
  queryParams = [];
  queryParamMap: ParamMap;
  fragment: '';
  data: ParamMap;
  outlet: '';
  component: '';
  root: ActivatedRouteSnapshot;
  routeConfig: {};
  parent: MockOfActivatedRouteSnapshot;
  firstChild: ActivatedRouteSnapshot;
  paramMap: ParamMap;
  children: [ActivatedRouteSnapshot];
  pathFromRoot: [ActivatedRouteSnapshot];

  constructor(depth: number = 1) {
    if (depth > 0) {
      this.parent = new MockOfActivatedRouteSnapshot(depth - 1);
    }
  }
}
