import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupData } from '../interfaces/group-data';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';

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
}
