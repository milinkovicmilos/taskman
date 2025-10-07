import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UserData } from '../../../../shared/interfaces/user-data';
import { UserService } from '../../../users/services/user-service';
import { Button } from '../../../../shared/components/button/button';
import { UserDetailData } from '../../../users/interfaces/user-detail-data';

@Component({
  selector: 'app-invite',
  imports: [ReactiveFormsModule, Button, InputElement],
  templateUrl: './invite.html',
  styleUrl: './invite.css'
})
export class Invite implements OnInit {
  private usersService = inject(UserService);

  private formBuilder = inject(FormBuilder);
  searchForm = this.formBuilder.group({
    search: ['', Validators.required],
  });

  protected users: WritableSignal<UserDetailData[]> = signal([]);

  ngOnInit(): void {
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe({
      next: (value) => {
        if (value != null && value !== '') {
          this.usersService.getUsers(value).subscribe({
            next: (response) => {
              this.users.set(response.data);
            }
          });
        }
        else {
          this.users.set([]);
        }
      }
    });
  }

  protected inviteUser(userId: number | string): void {

  }
}
