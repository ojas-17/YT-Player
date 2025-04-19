import { Component, ElementRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

declare var YT: any;

@Component({
  selector: 'app-video-card',
  standalone: true,
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() video: any;
  @Input() onVideoEnd: () => void = () => {};
  player: any;

  constructor(private el: ElementRef) {}

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
    const newVideoId = this.video?.snippet?.resourceId?.videoId;
  
    if (!newVideoId) {
      console.warn('Skipping player update — videoId is missing.');
      return;
    }
  
    // If player exists and is fully ready
    if (this.player && typeof this.player.loadVideoById === 'function') {
      this.player.loadVideoById(newVideoId);
    }
    // If player isn't ready yet, reinit it
    else if ((window as any).YT && YT.Player) {
      this.initPlayer();
    }
  }

  initPlayer() {
    const videoId = this.video?.snippet?.resourceId?.videoId;

    if (!videoId) {
      console.error('Invalid videoId:', videoId);
      return;
    }

    this.player = new YT.Player('yt-player', {
      videoId,
      events: {
        onReady: () => {
          console.log('YouTube Player is ready!');
        },
        onStateChange: (event: any) => {
          if (event.data === YT.PlayerState.ENDED) {
            this.onVideoEnd?.();
          }
        }
      },
      playerVars: {
        autoplay: 1,
        mute: 0,
        controls: 1,
        rel: 0,
        showinfo: 0
      }
    });
    
  }

  ngOnDestroy() {
    if (this.player && this.player.destroy) {
      this.player.destroy();
    }
  }
}
