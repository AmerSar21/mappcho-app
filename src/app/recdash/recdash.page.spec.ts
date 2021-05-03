import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecdashPage } from './recdash.page';

describe('RecdashPage', () => {
  let component: RecdashPage;
  let fixture: ComponentFixture<RecdashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecdashPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecdashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
