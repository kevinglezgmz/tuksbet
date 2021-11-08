import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../data-types/users';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ParentService {
  usersEndpoint = '/users/';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllUsers(): Promise<any> {
    return this.get(this.usersEndpoint);
  }

  getUserDetails(userId: string): Promise<any> {
    return this.get(this.usersEndpoint + userId);
  }

  createUser(user: User): Promise<any> {
    return this.create(this.usersEndpoint, user);
  }

  deleteUser(userId: string): Promise<any> {
    return this.delete(this.usersEndpoint + userId);
  }

  updateUser(user: User, userId: string): Promise<any> {
    return this.update(this.usersEndpoint + userId, user);
  }
}
