import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPerPage } from './search-per.page';

describe('SearchPerPage', () => {
  let component: SearchPerPage;
  let fixture: ComponentFixture<SearchPerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
