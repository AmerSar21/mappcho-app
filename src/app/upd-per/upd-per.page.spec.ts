import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdPerPage } from './upd-per.page';

describe('UpdPerPage', () => {
  let component: UpdPerPage;
  let fixture: ComponentFixture<UpdPerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdPerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdPerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
