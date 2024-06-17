import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectouComponent } from './selectou.component';

describe('SelectouComponent', () => {
  let component: SelectouComponent;
  let fixture: ComponentFixture<SelectouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectouComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
