import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPerPage } from './add-per.page';

describe('AddPerPage', () => {
  let component: AddPerPage;
  let fixture: ComponentFixture<AddPerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
