import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientId = 'c8421bcd510047408f8efd05ce9f5d80';
  private clientSecret = 'af91ccf71693465ca87aadf56ae6cc41';
  private redirectUri = 'http://localhost:4200/callback';
  private scope = 'user-top-read user-read-private user-read-email user-follow-read user-library-read user-read-recently-played';
  private spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&scope=${this.scope}&redirect_uri=${this.redirectUri}&response_type=token`;
  private accessToken: string = '';

  constructor(private http: HttpClient) { }

  login(): void {
    window.location.href = this.spotifyAuthUrl;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    window.location.href = this.redirectUri;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getTokenFromUrl(): string | null {
    const accessTokenRegex = /access_token=([^&]*)/;
    const match = window.location.hash.match(accessTokenRegex);
    return match && match[1] ? match[1] : null;
  }
}
