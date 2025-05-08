import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BkuInComponent } from './bku-in.component';

describe('BkuInComponent', () => {
  let component: BkuInComponent;
  let fixture: ComponentFixture<BkuInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BkuInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BkuInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
