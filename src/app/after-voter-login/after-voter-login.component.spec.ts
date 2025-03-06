import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterVoterLoginComponent } from './after-voter-login.component';

describe('AfterVoterLoginComponent', () => {
  let component: AfterVoterLoginComponent;
  let fixture: ComponentFixture<AfterVoterLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AfterVoterLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AfterVoterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
