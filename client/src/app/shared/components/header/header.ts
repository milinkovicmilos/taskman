import { Component, inject, signal } from '@angular/core';
import { Button } from '../button/button';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { filter } from 'rxjs';
import { HeaderButton } from '../../services/header-button';
import { LocalStorage } from '../../services/local-storage';

@Component({
  selector: 'app-header',
  imports: [RouterModule, Button],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private router = inject(Router);
  private urls: string[] = [];
  protected url = signal(this.router.url);

  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;

  userData = this.authService.data;
  buttonService = inject(HeaderButton);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          this.url.set(event.urlAfterRedirects);
          this.urls.push(this.url());
        }
      });
  }

  getFullName(): string {
    return `${this.userData().firstName} ${this.userData().lastName}`;
  }

  onMainHeaderButtonClick(): void {
    this.buttonService.clicked();
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToLogout(): void {
    this.router.navigate(['/logout']);
  }

  protected goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  protected goBack(): void {
    // Remove current page
    this.urls.pop();

    const url = this.urls.pop();
    this.router.navigate([url]);
  }

  protected importData(): void {
    const storage = new LocalStorage();

    const inputFile = document.createElement("input");
    inputFile.setAttribute("type", "file")
    inputFile.click();

    inputFile.addEventListener('change', () => {
      if (inputFile.files != null) {

        const file = inputFile.files[0];

        const reader = new FileReader();
        reader.readAsText(file);

        reader.addEventListener('load', () => {
          const data = reader.result?.toString();

          if (data != null) {
            storage.write(JSON.parse(data));
          }
        });
      }
    });
  }

  protected exportData(): void {
    const storage = new LocalStorage();

    const data = storage.fetch();

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "taskman-export.json";
    anchor.click();
  }
}
