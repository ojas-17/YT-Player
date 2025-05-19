import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';

declare var YT: any;

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() video: any;
  @Input() videoIndex = 0;
  @Input() playlistId = "";
  @Input() orderedVideoArray: any[] = [];
  @Input() videoArray: any[] = [];
  @Input() onVideoEnd: () => void = () => { };

  @Output() emitter = new EventEmitter<number>;

  player: any;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.video?.snippet?.resourceId?.videoId) {
        console.warn('Player init skipped — videoId is not available yet.');
        return;
      }

      if ((window as any).YT && YT.Player) {
        this.initPlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = () => {
          this.initPlayer();
        };
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('check', this.videoIndex);

    const newVideoId = this.video?.snippet?.resourceId?.videoId;

    if (!newVideoId) {
      console.warn('Skipping player update — videoId is missing.');
      return;
    }

    // If player exists and is fully ready
    if (this.player && typeof this.player.playVideoAt === 'function') {
      // this.player.loadVideoById(newVideoId);
      // this.initPlayer();
      this.player.playVideoAt(this.getCorrectIndex(this.videoIndex))

    }
    // If player isn't ready yet, reinit it
    else if ((window as any).YT && YT.Player) {
      this.initPlayer();
      // this.player.playVideoAt(this.videoIndex)
    }
  }

  getCorrectIndex(index: number): number {
    let video = this.videoArray[index]
    let correctIndex = this.orderedVideoArray.indexOf(video)
    
    return correctIndex
  }

  getReverseCorrectIndex(index: number): number {
    let video = this.orderedVideoArray[index]
    let correctIndex = this.videoArray.indexOf(video)
    
    return correctIndex
  }

  initPlayer() {
    const videoId = this.video?.snippet?.resourceId?.videoId;

    if (!videoId) {
      console.error('Invalid videoId:', videoId);
      return;
    }

    this.player = new YT.Player('yt-player', {
      videoId,
      height: '100%',
      width: '100%',
      events: {
        onReady: () => {
          console.log('YouTube Player is ready!');
          this.player.playVideoAt(this.videoIndex);
        },
        onStateChange: (event: any) => {
          if (event.data === YT.PlayerState.PLAYING) {
            const currentIndex = this.player.getPlaylistIndex?.();
            const currentVideoId = this.player.getVideoData().video_id;
            // console.log('Now playing index:', currentIndex, 'videoId:', currentVideoId);
            console.log(this.getCorrectIndex(this.videoIndex), currentIndex);
            if(currentIndex === this.getCorrectIndex(this.videoIndex) + 1) {
              this.emitter.emit(this.videoIndex + 1);
            }
            else if(currentIndex === this.getCorrectIndex(this.videoIndex) - 1) {
              this.emitter.emit(this.videoIndex - 1);
            }
            else {
              // this.videoIndex = this.getReverseCorrectIndex(currentIndex);
              this.emitter.emit(this.getReverseCorrectIndex(currentIndex));
            }
          }

          if (event.data === YT.PlayerState.ENDED) {
            this.onVideoEnd?.();
          }
        }
      },
      playerVars: {
        listType: 'playlist',
        list: this.playlistId,
        // index: this.videoIndex,
        autoplay: 1,
        mute: 0,
        controls: 1,
        rel: 0,
        showinfo: 0,
      }
    });

  }

  ngOnDestroy() {
    if (this.player && this.player.destroy) {
      this.player.destroy();
    }
  }
}
