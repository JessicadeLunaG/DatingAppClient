import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginateResult } from '../_models/pagination';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginateResult<Member[]> = new PaginateResult<Member[]>();

  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPerPage?: number): Observable<PaginateResult<Member[]>>{
    let params = new HttpParams();

    if(page !== null && itemsPerPage !== null)
    {
      params = params.append("pageNumber", page.toString());
      params = params.append("pageSize", itemsPerPage.toString());
    }
    return this.http.get<Member[]>(this.baseUrl + "users", { observe: "response" , params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body;
        if(response.headers.get("Pagination") !== null) {
          this.paginatedResult.pagination =  JSON.parse(response.headers.get("Pagination"));
        }
        return this.paginatedResult;
      })
      
    );
  }

  getMember(username:string): Observable<Member>{
    const member = this.members.find(x => x.userName === username);
    if(member !== undefined) return of(member); 
    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member: Member): Observable<void>{
    return this.http.put(this.baseUrl + "users", member).pipe(
      map(() => {
        const index =  this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number): Observable<Object>
  {
    return this.http.put(this.baseUrl + "users/photos/" + photoId, {})
  }

  deletePhoto(photoId: number): Observable<Object>
  {
    return this.http.delete(this.baseUrl + "users/photos/" + photoId);
  }

}
