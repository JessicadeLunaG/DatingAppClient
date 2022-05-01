import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]>{
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + "users").pipe(
      map(members => {
        this.members = members;
        return members;
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
