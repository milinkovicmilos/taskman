import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../../shared/interfaces/message-response';
import { CreateMembershipData } from '../interfaces/create-membership-data';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private http = inject(HttpClient);

  inviteUser(groupId: number | string, membership: CreateMembershipData): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`api/groups/${groupId}/memberships`, membership);
  }
}
