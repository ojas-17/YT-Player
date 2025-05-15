import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-playlist-item',
  imports: [DatePipe],
  templateUrl: './playlist-item.component.html',
  styleUrl: './playlist-item.component.css'
})
export class PlaylistItemComponent {
  @Input() video: any;
  @Input() index: number = 0;
  @Input() currentIndex: number = 0;

  @Output() emitter = new EventEmitter<number>;

  handleClick() {
    this.emitter.emit(this.index);
  }

}
