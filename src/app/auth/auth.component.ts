import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [MatButtonModule, MatSidenavModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  constructor( private router: Router) {}

  startAnimation() {
    let btn = document.getElementById("btnGo");

    if (!btn) return this.login();

    btn.style.transition = "transform 0.5s ease-out";
    btn.style.transform = "translateX(150px)";

    setTimeout(() => {
        this.login();
    }, 500);
}

  login() {
    this.router.navigateByUrl('/stadistics');
  }

  register() {
    this.router.navigateByUrl('/registerMatch');
  }
}
