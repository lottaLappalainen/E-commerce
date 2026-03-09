import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  role$ = this.authService.state$
    .pipe(map(state => state.role));

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}