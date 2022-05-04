import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginateResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams(): UserParams {
    return this.userParams;
  }

  setUserParams(params: UserParams): void {
    this.userParams = params;
  }

  resetUserParams(): UserParams {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(UserParams: UserParams): Observable<PaginateResult<Member[]>>{
    var response = this.memberCache.get(Object.values(UserParams).join("-"));
    if(response) return of(response);

    let params =  this.getPaginationHeaders(UserParams.pageNumber, UserParams.pageSize);

    params = params.append("minAge", UserParams.minAge.toString());
    params = params.append("maxAge", UserParams.maxAge.toString());
    params = params.append("gender", UserParams.gender);
    params = params.append("orderBy", UserParams.orderBy);

    return this.getPaginateResult<Member[]>(this.baseUrl + "users", params)
      .pipe(map(response => {
        this.memberCache.set(Object.values(UserParams).join("-"), response);
        return response;
      }))
  }

  private getPaginateResult<T>(url: string, params: HttpParams): Observable<PaginateResult<T>> {
    const paginatedResult: PaginateResult<T> = new PaginateResult<T>();
    
    return this.http.get<T>(url, { observe: "response", params }).pipe(
      map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get("Pagination") !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    params = params.append("pageNumber", pageNumber.toString());
    params = params.append("pageSize", pageSize.toString());

    return params;
  }

  getMember(username:string): Observable<Member>{
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);
    
    if(member) return of(member); 
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
