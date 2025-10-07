import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMembershipCard } from './user-membership-card';

describe('UserMembershipCard', () => {
  let component: UserMembershipCard;
  let fixture: ComponentFixture<UserMembershipCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMembershipCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMembershipCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
