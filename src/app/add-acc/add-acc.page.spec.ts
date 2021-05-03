import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccPage } from './add-acc.page';

describe('AddAccPage', () => {
  let component: AddAccPage;
  let fixture: ComponentFixture<AddAccPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
