import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IsDarkThemeService {
  isDarkTheme: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    const currentTheme = localStorage.getItem('theme') || undefined;
    if (!currentTheme) {
      this.setDarkTheme();
    } else {
      this.isDarkTheme.next(currentTheme === 'Dark');
    }
  }

  isCurrentThemeDark(): Observable<boolean> {
    return this.isDarkTheme.asObservable();
  }

  setLightTheme(): void {
    localStorage.setItem('theme', 'Light');
    this.isDarkTheme.next(false);
  }

  setDarkTheme(): void {
    localStorage.setItem('theme', 'Dark');
    this.isDarkTheme.next(true);
  }
}
