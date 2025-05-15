import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  maxResults = 100;

  constructor(private http:HttpClient) { }

  getVideos(playlistId: string, pageToken: string) {
    const baseUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${this.maxResults}&key=${environment.apiKey}`
    let url = baseUrl;
    if(pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    return this.http.get(url);
  }
}
