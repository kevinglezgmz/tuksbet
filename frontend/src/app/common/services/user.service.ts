import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../data-types/users';
import { ParentService } from './parent.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ParentService {
  usersEndpoint = '/users';

  constructor(httpClient: HttpClient, private authService: AuthService) {
    super(httpClient);
  }

  getAllUsers(currentPage: number, recordsPerPage: number): Promise<any> {
    return this.get(this.usersEndpoint + '?page=' + currentPage + '&limit=' + recordsPerPage);
  }

  getUserDetails(userId: string): Promise<any> {
    return this.get(this.usersEndpoint + '/' + userId);
  }

  createUser(user: User): Promise<any> {
    return this.create(this.usersEndpoint, user);
  }

  deleteUser(userId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.delete(this.usersEndpoint + '/' + userId, headers);
  }

  updateUser(user: User | FormData, userId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.update(this.usersEndpoint + '/' + userId, user, headers);
  }
}
