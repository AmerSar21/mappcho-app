import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdItrPage } from './upd-itr.page';

describe('UpdItrPage', () => {
  let component: UpdItrPage;
  let fixture: ComponentFixture<UpdItrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdItrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdItrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
