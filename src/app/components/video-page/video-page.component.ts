import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VideoCardComponent } from "../video-card/video-card.component";
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlaylistItemComponent } from "../playlist-item/playlist-item.component";

@Component({
  selector: 'app-video-page',
  imports: [VideoCardComponent, PlaylistItemComponent],
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.css'
})
export class VideoPageComponent {
  playlistId = '';
  videos: any[] = [];
  orderedVideos: any[] = [];
  shuffledVideos: any[] = [];
  shuffle = signal(false);
  // videoIndex: number[] = [];
  currentIndex = 0;
  totalPages = 1;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // console.log(params.get('id'))
      this.playlistId = params.get('id') || '';
      this.getVideos();
    })
  }

  async getVideos() {
    let nextPageToken = '';
    this.orderedVideos = [];

    for (let i = 0; i < this.totalPages; i++) {
      try {
        const response: any = await firstValueFrom(this.api.getVideos(this.playlistId, nextPageToken));
        this.orderedVideos = this.orderedVideos.concat(response.items);

        console.log(`Page ${i + 1} videos:`, response.items);

        this.totalPages = Math.ceil(response.pageInfo.totalResults / response.pageInfo.resultsPerPage)

        if (!response.nextPageToken) {
          break; // No more pages to fetch
        }

        nextPageToken = response.nextPageToken;
      } catch (error) {
        console.error('API call failed:', error);
        break;
      }
    }

    this.videos = this.orderedVideos;
    console.log('Final videos:', this.videos);
  }

  shuffleArray(inputArray: any[]): any[] {
    let array = [...inputArray];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
  }

  handleEnd = () => {
    console.log('A video ended!');
    if (this.currentIndex + 1 < this.videos.length) {
      this.currentIndex++;
    }
    else {
      this.currentIndex = 0;
    }
  };

  handleChange(index: number) {
    this.currentIndex = index
  }

  toggleShuffle() {
    if(this.shuffle()) {
      console.log('check');
      this.shuffle.set(false)
      this.videos = this.orderedVideos
      console.log(this.orderedVideos);
      
    }
    else {
      this.shuffle.set(true)
      this.shuffledVideos = this.shuffleArray(this.orderedVideos);
      this.videos = this.shuffledVideos
    }

    this.currentIndex = 0
    // this.shuffledVideos = this.shuffleArray(this.videos)
  }
}
