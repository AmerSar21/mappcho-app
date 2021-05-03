import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAllPage } from './activity-all.page';

describe('ActivityAllPage', () => {
  let component: ActivityAllPage;
  let fixture: ComponentFixture<ActivityAllPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityAllPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
