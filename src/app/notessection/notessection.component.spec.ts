import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotessectionComponent } from './notessection.component';

describe('NotessectionComponent', () => {
  let component: NotessectionComponent;
  let fixture: ComponentFixture<NotessectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotessectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotessectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
