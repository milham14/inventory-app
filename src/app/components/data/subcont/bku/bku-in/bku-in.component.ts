import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-bku-in',
  imports: [ CommonModule, FormsModule ],
  host: { ngSkipHydration: 'true' },
  templateUrl: './bku-in.component.html',
  styleUrl: './bku-in.component.css'
})
export class BkuInComponent {

}
