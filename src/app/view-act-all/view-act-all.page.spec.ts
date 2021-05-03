import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActAllPage } from './view-act-all.page';

describe('ViewActAllPage', () => {
  let component: ViewActAllPage;
  let fixture: ComponentFixture<ViewActAllPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActAllPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
