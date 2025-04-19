import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoCardComponent } from "./components/video-card/video-card.component";
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [VideoCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  videos: any[] = [];
  currentIndex = 0;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getVideos();
  }

  getVideos() {
    this.api.getVideos().subscribe((response: any) => {
      this.videos = response.items;
      // console.log(response.items);
    })
  }

  handleEnd = () => {
    console.log('A video ended!');
    if (this.currentIndex + 1 < this.videos.length) {
      this.currentIndex++;
    }
  };
}
