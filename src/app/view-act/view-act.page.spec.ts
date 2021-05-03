import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActPage } from './view-act.page';

describe('ViewActPage', () => {
  let component: ViewActPage;
  let fixture: ComponentFixture<ViewActPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
