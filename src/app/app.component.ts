import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ShareDataService } from './Services/share-data.service';
import { CommonModule } from '@angular/common';
import { NotessectionComponent } from './notessection/notessection.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, NotessectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'NotesApp';

  constructor(private s : ShareDataService, private renderer: Renderer2) {}

  @ViewChild('maincontainer') maincontainer!: ElementRef;

  isDark!:boolean;
  newHeight!:number | null;
  viewChecked: boolean = false;

  ngOnInit(){
    this.s.mode.subscribe(
      (value) => {
        this.isDark = value;
      }
    );

    this.s.changeheightvalue.subscribe(
      (value) => {
        this.newHeight = value;
        this.ngAfterViewChecked();
      }
    );
  }

  ngAfterViewChecked() {
    if (this.newHeight && this.maincontainer) {
      let htval = this.newHeight/416;
      // console.log(htval);
      if (htval>1) {
        let ht = 100;
        for(let i = 2;i<=htval;i++){
          ht+=55;
        }
        // console.log(ht)
        this.renderer.setStyle(this.maincontainer.nativeElement, 'height', (ht+'vh'));
      }
      else{
        this.renderer.setStyle(this.maincontainer.nativeElement, 'height', '100vh');
      }
    }
    this.newHeight = null;
  }

}
