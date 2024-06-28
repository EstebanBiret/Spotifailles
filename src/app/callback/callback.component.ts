import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const token = this.authService.getTokenFromUrl();
    if (token !== null) {
      this.authService.setAccessToken(token);
      localStorage.setItem('accessToken', token);
      this.router.navigate(['/']);
    } else {
      console.error('Token d\'accès introuvable dans l\'URL.');
    }
  }
}
