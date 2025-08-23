import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodologiaComponent } from './metodologia.component';

describe('MetodologiaComponent', () => {
  let component: MetodologiaComponent;
  let fixture: ComponentFixture<MetodologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodologiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
