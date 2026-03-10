import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pairing } from './pairing';

describe('Pairing', () => {
  let component: Pairing;
  let fixture: ComponentFixture<Pairing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pairing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pairing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
