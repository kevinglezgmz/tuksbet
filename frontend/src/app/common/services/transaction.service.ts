import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../data-types/transaction';
import { AuthService } from './auth.service';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends ParentService {
  transactionsEndpoint = '/transactions';

  constructor(httpClient: HttpClient, private authService: AuthService) {
    super(httpClient);
  }

  getAllTransactions(page: number, limit: number): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.get(this.transactionsEndpoint + '?page=' + page + '&limit=' + limit, headers);
  }

  getTransactionDetails(transactionId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.get(this.transactionsEndpoint + '/' + transactionId, headers);
  }

  createTransaction(transaction: Transaction): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.create(this.transactionsEndpoint, transaction, headers);
  }

  deleteTransaction(transactionId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.delete(this.transactionsEndpoint + '/' + transactionId, headers);
  }

  updateTransaction(transaction: Transaction, transactionId: string): Promise<any> {
    return this.update(this.transactionsEndpoint + '/' + transactionId, transaction);
  }
}
