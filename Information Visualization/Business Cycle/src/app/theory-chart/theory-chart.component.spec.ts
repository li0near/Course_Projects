import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoryChartComponent } from './theory-chart.component';

describe('TheoryChartComponent', () => {
  let component: TheoryChartComponent;
  let fixture: ComponentFixture<TheoryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheoryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
