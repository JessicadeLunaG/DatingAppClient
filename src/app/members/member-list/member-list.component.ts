import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{value: "female", display: "Females"}, {value: "male", display: "Males"}]

  constructor(private membersService: MembersService, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.membersService.getMembers(this.userParams).subscribe(response => {
      this.members =  response.result;
      this.pagination =  response.pagination;
    })
  }

  pageChanged(event: any): void {
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }

  resetFilters(){
    this.userParams = new UserParams(this.user);
    this.loadMembers();
  }
}
