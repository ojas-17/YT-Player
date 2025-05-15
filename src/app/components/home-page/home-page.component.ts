import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  url = "";

  constructor(private router: Router) { }
  
  handleSearch() {
      const urlObj = new URL(this.url);
      let playlistId = urlObj.searchParams.get('list') || '';
      this.router.navigate([`/${playlistId}`])
  }
}
