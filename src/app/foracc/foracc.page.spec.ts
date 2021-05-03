import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForaccPage } from './foracc.page';

describe('ForaccPage', () => {
  let component: ForaccPage;
  let fixture: ComponentFixture<ForaccPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForaccPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForaccPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
