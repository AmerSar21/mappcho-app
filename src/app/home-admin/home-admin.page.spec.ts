import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAdminPage } from './home-admin.page';

describe('HomeAdminPage', () => {
  let component: HomeAdminPage;
  let fixture: ComponentFixture<HomeAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
