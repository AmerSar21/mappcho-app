import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdActPage } from './upd-act.page';

describe('UpdActPage', () => {
  let component: UpdActPage;
  let fixture: ComponentFixture<UpdActPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdActPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdActPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
