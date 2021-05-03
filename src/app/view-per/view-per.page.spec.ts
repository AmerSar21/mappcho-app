import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPerPage } from './view-per.page';

describe('ViewPerPage', () => {
  let component: ViewPerPage;
  let fixture: ComponentFixture<ViewPerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
