import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NavComponent } from './shared/ui/components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'email-app';

  private authGuard = inject(AuthGuard);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.authGuard.canActivate(
      this.activatedRoute.snapshot, 
      this.router.routerState.snapshot,
    );
  }
}
