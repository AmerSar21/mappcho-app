import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndivtreatrecPage } from './indivtreatrec.page';

describe('IndivtreatrecPage', () => {
  let component: IndivtreatrecPage;
  let fixture: ComponentFixture<IndivtreatrecPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndivtreatrecPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndivtreatrecPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
