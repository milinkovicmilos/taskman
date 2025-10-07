import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../../shared/interfaces/message-response';
import { CreateMembershipData } from '../interfaces/create-membership-data';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { MembershipData } from '../interfaces/membership-data';
import { UpdateMembershipData } from '../interfaces/update-membership-data';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private http = inject(HttpClient);

  getUsers(groupId: number | string, page: number = 1): Observable<PaginatedResponse<MembershipData>> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<PaginatedResponse<MembershipData>>(`api/groups/${groupId}/memberships`, { params: params });
  }

  inviteUser(groupId: number | string, membership: CreateMembershipData): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`api/groups/${groupId}/memberships`, membership);
  }

  updateMembership(groupId: number | string, membershipId: number | string, membership: UpdateMembershipData): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`api/groups/${groupId}/memberships/${membershipId}`, membership);
  }

  removeMembership(groupId: number | string, membershipId: number | string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`api/groups/${groupId}/memberships/${membershipId}`);
  }
}
