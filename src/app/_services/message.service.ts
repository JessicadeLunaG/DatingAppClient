import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { PaginateResult } from '../_models/pagination';
import { getPaginateResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessages(pageNumber:number, pageSize: number, container: string): Observable<PaginateResult<Message[]>>{
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("predicate", container);

    return getPaginateResult<Message[]>(this.baseUrl + "messages", params, this.http);
  }
}
