import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../data-types/transaction';
import { AuthService } from './auth.service';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends ParentService {
  transactionsEndpoint = '/transactions/';

  constructor(httpClient: HttpClient, private authService: AuthService) {
    super(httpClient);
  }

  getAllTransactions(): Promise<any> {
    return this.get(this.transactionsEndpoint);
  }

  getTransactionDetails(transactionId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.get(this.transactionsEndpoint + transactionId, headers);
  }

  createTransaction(transaction: Transaction): Promise<any> {
    return this.create(this.transactionsEndpoint, transaction);
  }

  deleteTransaction(transactionId: string): Promise<any> {
    return this.delete(this.transactionsEndpoint + transactionId);
  }

  updateTransaction(transaction: Transaction, transactionId: string): Promise<any> {
    return this.update(this.transactionsEndpoint + transactionId, transaction);
  }
}
