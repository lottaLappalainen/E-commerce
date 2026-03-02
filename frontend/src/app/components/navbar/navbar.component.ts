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

  capitalizedRole$ = this.role$
    .pipe(map(role => role.charAt(0).toUpperCase() + role.slice(1)));

  handleLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}