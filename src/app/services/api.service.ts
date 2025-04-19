import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  maxResults = 10;
  baseUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${environment.playlistId}&maxResults=${this.maxResults}&key=${environment.apiKey}`

  constructor(private http:HttpClient) {
    
  }

  getVideos() {
    return this.http.get(this.baseUrl);
  }
}
