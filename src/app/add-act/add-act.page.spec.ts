import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActPage } from './add-act.page';

describe('AddActPage', () => {
  let component: AddActPage;
  let fixture: ComponentFixture<AddActPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
