import { Directive, Input, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appShowIfLogged]',
})
export class ShowIfLoggedDirective {
  @Input() appShowIfLogged: boolean = true;

  constructor(private authService: AuthService, private elementRef: ElementRef) {}

  ngOnInit() {
    if (!this.appShowIfLogged && this.authService.isLoggedIn()) {
      this.elementRef.nativeElement.remove();
    }
  }
}
