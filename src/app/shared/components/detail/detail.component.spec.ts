import { Shallow } from 'shallow-render';

import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockOfActivatedRoute } from 'tests/mocks/activated-route.mock';
import { PageHeaderAction } from '../page-header/page-header-action.enum';
import { DetailMockComponent } from './detail-mock/detail-mock.component';
import { DetailComponent } from './detail.component';
import { DetailModule } from './detail.module';

describe('DetailComponent', () => {
  let shallow: Shallow<DetailComponent<any>>;

  const childComponent = jasmine.createSpyObj('ApiObsHelper', ['archive', 'postOrPatch']);

  beforeEach(() => {
    shallow = new Shallow(DetailMockComponent, DetailModule)
      .provide(ActivatedRoute)
      .mock(ActivatedRoute, new MockOfActivatedRoute())
      .provide(Location)
      .mock(Location, {
        back: () => {},
      })
      .import(RouterTestingModule)
      .mock(Router, {
        navigate: jasmine.createSpy('navigate'),
      });
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });

  it('should disable/enable', async () => {
    const { instance } = await shallow.render();
    instance.form = new FormGroup({});
    instance.disable();
    expect(instance.form.disabled).toBeTruthy();
    instance.enable();
    expect(instance.form.enabled).toBeTruthy();
  });

  it('should archive resource', async () => {
    const { instance } = await shallow.render();
    instance.apiObsHelper = childComponent;
    const fakeId = 'fakeId';
    instance.detailId = fakeId;
    instance.archive();
    expect(instance.apiObsHelper.archive).toHaveBeenCalledWith(fakeId, false);
  });

  it('should handle onPageHeaderEvent', async () => {
    const { instance } = await shallow.render();
    const archiveSpy = spyOn(instance, 'archive').and.callFake(() => {});
    const enableSpy = spyOn(instance, 'enable').and.callFake(() => {});
    const disableSpy = spyOn(instance, 'disable').and.callFake(() => {});
    const submitSpy = spyOn(instance, 'submit').and.callFake(() => {});
    const nextSpy = spyOn(instance.refresh, 'next').and.callFake(() => {});
    const location = TestBed.get(Location);

    expect(location.back).toHaveBeenCalledTimes(0);
    instance.onPageHeaderEvent({ action: PageHeaderAction.BACK });
    expect(location.back).toHaveBeenCalledTimes(1);

    expect(nextSpy).toHaveBeenCalledTimes(0);
    expect(disableSpy).toHaveBeenCalledTimes(0);
    instance.onPageHeaderEvent({ action: PageHeaderAction.CANCEL });
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(disableSpy).toHaveBeenCalledTimes(1);

    expect(archiveSpy).toHaveBeenCalledTimes(0);
    instance.onPageHeaderEvent({ action: PageHeaderAction.ARCHIVE });
    expect(archiveSpy).toHaveBeenCalledTimes(1);

    expect(enableSpy).toHaveBeenCalledTimes(0);
    instance.onPageHeaderEvent({ action: PageHeaderAction.UPDATE });
    expect(enableSpy).toHaveBeenCalledTimes(1);

    expect(submitSpy).toHaveBeenCalledTimes(0);
    instance.onPageHeaderEvent({ action: PageHeaderAction.SAVE });
    expect(submitSpy).toHaveBeenCalledTimes(1);

    // All spies expected to be called only once, so no unwanted behaviors
    expect(location.back).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(disableSpy).toHaveBeenCalledTimes(1);
    expect(archiveSpy).toHaveBeenCalledTimes(1);
    expect(enableSpy).toHaveBeenCalledTimes(1);
    expect(submitSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle onPostedOrPatched', async () => {
    const { instance } = await shallow.mock(DetailMockComponent, {}).render();
    const disableSpy = spyOn(instance, 'disable').and.callFake(() => {});
    const router = TestBed.get(Router);
    const activatedRoute = TestBed.get(ActivatedRoute);

    expect(disableSpy).toHaveBeenCalledTimes(0);
    instance.detailId = 'fakeId';
    instance.onPostedOrPatched({ _id: '' });
    expect(disableSpy).toHaveBeenCalledTimes(1);

    expect(disableSpy).toHaveBeenCalledTimes(1);
    instance.detailId = 'new';
    instance.onPostedOrPatched({ _id: 'createdId' });
    expect(router.navigate).toHaveBeenCalledWith(['..', 'createdId'], {
      relativeTo: activatedRoute,
      replaceUrl: true,
    });
    expect(disableSpy).toHaveBeenCalledTimes(1);
  });

  it('should submit', async () => {
    const { instance } = await shallow.render();
    instance.apiObsHelper = childComponent;
    instance.submit();
    expect(instance.apiObsHelper.postOrPatch).not.toHaveBeenCalled();
    instance.form = new FormGroup({ _required: new FormControl('', Validators.required) });
    instance.submit();
    expect(instance.apiObsHelper.postOrPatch).not.toHaveBeenCalled();
    instance.form = new FormGroup({});
    instance.submit();
    expect(instance.apiObsHelper.postOrPatch).toHaveBeenCalled();
  });
});
