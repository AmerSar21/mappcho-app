import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccPage } from './view-acc.page';

describe('ViewAccPage', () => {
  let component: ViewAccPage;
  let fixture: ComponentFixture<ViewAccPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAccPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
