import { Component, OnInit, HostListener  } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import * as $ from 'jquery';

import './script.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accessToken: string = '';
  actualUser: any = null;
  following: any = null;
  totalAlbums: any = null;
  albums: any = null;
  artists: any = null;
  tracks: any = null;
  recent_tracks: any = null;
  currentSection: string = 'home-section';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    let token = localStorage.getItem('accessToken');
    if (token) {
        this.accessToken = token;
        this.getActualUser();
        this.getFollowing();
        this.getAlbums(5);
        this.getTopArtists(5);
        this.getTopTracks(5);
        this.getRecentTracks(5);
    } else {
      this.authService.login(); // Redirige vers la page d'authentification de Spotify
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = document.querySelectorAll('div[id$="-section"]'); // Select divs with IDs ending in "-section"
    const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

    sections.forEach(section => {
      const sectionElement = section as HTMLElement;
      if (sectionElement.offsetTop <= scrollPos && (sectionElement.offsetTop + sectionElement.offsetHeight) > scrollPos) {
        this.currentSection = sectionElement.getAttribute('id') ?? 'home-section';
      }
    });
  }

  onSectionClick(sectionId: string) {
    this.currentSection = sectionId;
  }

  capitalizeWords(str: string): string {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getActualUser() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    this.http.get('https://api.spotify.com/v1/me/', { headers }).pipe(
      catchError((error: any) => {
        if (error.error.error.status === 401) {
          // Problème d'authentification détecté, rediriger vers la page de connexion
          window.alert('Veuillez vous reconnecter.');
          this.authService.login();
        }
        return throwError(error);
      })
    ).subscribe((response: any) => {
      this.actualUser = response;
    });
  }

  getTopArtists(limit: number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    this.http.get(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, { headers }).pipe(
      catchError((error: any) => {
        console.log(error);
        if (error.error.error.status === 401) {
          // Problème d'authentification détecté, rediriger vers la page de connexion
          window.alert('Veuillez vous reconnecter.');
          this.authService.login();
        }
        return throwError(error);
      })
    ).subscribe((response: any) => {
      console.log('Top artists :', response);
      this.artists = response.items;
    });
  }

  handleArtistLimitChange(event: any) {
    const limit = event.target.value;
    this.getTopArtists(limit);
  }

  artistProfile(index: number) {
    const url = this.artists[index]['external_urls']['spotify'];
    window.open(url, '_blank');  
  }

  getTopTracks(limit: number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    this.http.get(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}`, { headers }).pipe(
      catchError((error: any) => {
        if (error.error.error.status === 401) {
          // Problème d'authentification détecté, rediriger vers la page de connexion
          window.alert('Veuillez vous reconnecter.');
          this.authService.login();
        }
        return throwError(error);
      })
    ).subscribe((response: any) => {
      console.log('Top tracks :', response);
      this.tracks = response.items;
    });
  }

  handleTrackLimitChange(event: any) {
    const limit = event.target.value;
    this.getTopTracks(limit);
  }

  trackProfile(index: number) {
    const url = this.tracks[index]['external_urls']['spotify'];
    window.open(url, '_blank');  
  }

  artistTrackProfile(indexTrack: number, indexArtist: number) {
    const artistId = this.tracks[indexTrack]["artists"][indexArtist]["id"];
    const url = `https://open.spotify.com/artist/${artistId}`;
    window.open(url, '_blank');  
  }

  getFollowing(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    this.http.get('https://api.spotify.com/v1/me/following?type=artist', { headers }).pipe(
      catchError((error: any) => {
        console.log(error);
        if (error.error.error.status === 401) {
          // Problème d'authentification détecté, rediriger vers la page de connexion
          window.alert('Veuillez vous reconnecter.');
          this.authService.login();
        }
        return throwError(error);
      })
    ).subscribe((response: any) => {
      console.log('Following : ', response['artists']);
      this.following = response['artists'];
    });
  }

  getAlbums(limit: number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    this.http.get(`https://api.spotify.com/v1/me/albums?limit=${limit}`, { headers }).pipe(
      catchError((error: any) => {
        console.log(error);
        if (error.error.error.status === 401) {
          // Problème d'authentification détecté, rediriger vers la page de connexion
          window.alert('Veuillez vous reconnecter.');
          this.authService.login();
        }
        return throwError(error);
      })
    ).subscribe((response: any) => {
      console.log('Albums : ', response);
      this.albums = response.items;
      this.totalAlbums = response.total;
      console.log(this.totalAlbums);
    });
  }

  handleAlbumLimitChange(event: any) {
    const limit = event.target.value;
    this.getAlbums(limit);
  }

  albumProfile(index: number) {
    const url = this.albums[index]['album']['external_urls']['spotify'];
    window.open(url, '_blank');  
  }

  artistAlbumProfile(indexAlbum: number, indexArtist: number) {
    const artistId = this.albums[indexAlbum]["album"]["artists"][indexArtist]["id"];
    const url = `https://open.spotify.com/artist/${artistId}`;
    window.open(url, '_blank');  
  }

  getRecentTracks(limit: number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    this.http.get(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, { headers }).pipe(
      catchError((error: any) => {
        console.log(error);
        if (error.error.error.status === 401) {
          // Problème d'authentification détecté, rediriger vers la page de connexion
          window.alert('Veuillez vous reconnecter.');
          this.authService.login();
        }
        return throwError(error);
      })
    ).subscribe((response: any) => {
      console.log('Recent tracks : ', response);
      this.recent_tracks = response.items;
    });
  }

  handleRecentTracksLimitChange(event: any) {
    const limit = event.target.value;
    this.getRecentTracks(limit);
  }

  recentTrackProfile(index: number) {
    const url = this.recent_tracks[index]['track']['external_urls']['spotify'];
    window.open(url, '_blank');  
  }

  recentTrackProfileArtistProfile(indexRecentTrack: number, indexArtist: number) {
    const artistId = this.recent_tracks[indexRecentTrack]["track"]["artists"][indexArtist]["id"];
    const url = `https://open.spotify.com/artist/${artistId}`;
    window.open(url, '_blank');  
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('fr-FR', options);
  }
  
  videToken() {
    localStorage.setItem('accessToken', 'YASH');
    window.location.reload();
  }

  userLinkProfile() {
    const url = this.actualUser['external_urls']['spotify'];
    window.open(url, '_blank');  
  }

  userLinkFollowing() {
    const url = `https://open.spotify.com/user/${this.actualUser['id']}/following`
    window.open(url, '_blank');  
  }

  userLinkAlbums() {
    const url = `https://open.spotify.com/user/${this.actualUser['id']}/albums`
    window.open(url, '_blank');  
  }

  fish() {
    const url = 'https://fish.embuscade.tech/'
    window.open(url, '_blank');  
  }
  
}
