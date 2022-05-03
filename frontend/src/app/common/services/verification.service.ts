import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  email: string = '';
  completedEmail: string = '';

  constructor() {
    this.email = localStorage.getItem('verificationEmail') || '';
  }

  needsVerification() {
    return this.email !== '';
  }

  getVerificationEmail() {
    return this.email;
  }

  setVerificationEmail(email: string) {
    localStorage.setItem('verificationEmail', email);
    this.email = email;
  }

  completeVerification() {
    localStorage.removeItem('verificationEmail');
    this.completedEmail = this.email;
    this.email = '';
  }

  cancelVerification() {
    localStorage.removeItem('verificationEmail');
    this.completedEmail = '';
    this.email = '';
  }
}
