import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrigemComponent } from './origem.component';

describe('OrigemComponent', () => {
  let component: OrigemComponent;
  let fixture: ComponentFixture<OrigemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrigemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrigemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
