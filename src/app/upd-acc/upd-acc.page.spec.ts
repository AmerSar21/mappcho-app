import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdAccPage } from './upd-acc.page';

describe('UpdAccPage', () => {
  let component: UpdAccPage;
  let fixture: ComponentFixture<UpdAccPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdAccPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdAccPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
