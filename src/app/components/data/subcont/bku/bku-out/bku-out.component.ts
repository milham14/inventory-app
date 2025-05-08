import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-bku-out',
  imports: [ CommonModule, FormsModule ],
  host: { ngSkipHydration: 'true' },
  templateUrl: './bku-out.component.html',
})
export class BkuOutComponent {

}
