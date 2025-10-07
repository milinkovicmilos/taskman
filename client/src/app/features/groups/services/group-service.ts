import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupData } from '../interfaces/group-data';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { MessageResponse } from '../../../shared/interfaces/message-response';
import { CreateGroupData } from '../interfaces/create-group-data';
import { CreatedGroupResponse } from '../interfaces/created-group-response';
import { GroupDetailData } from '../interfaces/group-detail-data';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);

  getGroups(page: number = 1): Observable<PaginatedResponse<GroupData>> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<PaginatedResponse<GroupData>>('api/groups', { params: params });
  }

  getGroup(groupId: number | string): Observable<GroupDetailData> {
    return this.http.get<GroupDetailData>(`api/groups/${groupId}`);
  }

  createGroup(group: CreateGroupData): Observable<CreatedGroupResponse> {
    return this.http.post<CreatedGroupResponse>('api/groups', group);
  }

  deleteGroup(groupId: number | string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`api/groups/${groupId}`);
  }
}
