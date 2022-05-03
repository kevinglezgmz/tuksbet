import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { VerificationService } from '../services/verification.service';

@Injectable({
  providedIn: 'root',
})
export class VerificationGuard implements CanActivate {
  constructor(private verificationService: VerificationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.verificationService.needsVerification()) {
      this.router.navigate(['verify']);
      return false;
    } else {
      return true;
    }
  }
}
