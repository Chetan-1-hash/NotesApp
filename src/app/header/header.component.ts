import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faLightbulb, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ShareDataService } from '../Services/share-data.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  Bulb = faLightbulb;
  Bell = faBell;
  Trash = faTrashCan;
  navBar = faBars;

  constructor(private s: ShareDataService) { }

  isDark: boolean = true;
  ModeType: string = "Dark";
  isPermanentlyOpen: boolean = false;
  isOpened: boolean = false;
  bgC!: string;

  setModeType() {
    this.isDark = !this.isDark;
    this.s.setMode(this.isDark);
    if (this.isDark) {
      this.ModeType = "Dark";
    }
    else {
      this.ModeType = "Light";
    }
  }


  @ViewChild('sideNav') sideNav!: ElementRef;
  showSideBar(){
    this.isPermanentlyOpen = !this.isPermanentlyOpen;
    if (this.sideNav && this.isPermanentlyOpen) {
      this.sideNav.nativeElement.classList.toggle('open');
      this.s.setSectionLocation(this.isPermanentlyOpen);
      this.isOpened = true;
    }
    else{
      this.sideNav.nativeElement.classList.remove('open');
      this.s.setSectionLocation(this.isPermanentlyOpen);
      this.isOpened = false;
    }
  }
  showSideBarHover() {
    if (!this.isPermanentlyOpen) {
      if (this.sideNav) {
        this.sideNav.nativeElement.classList.toggle('open');
      }
      this.isOpened = !this.isOpened;
      this.s.setSectionLocation(this.isOpened);
      if (this.isOpened) {
        this.bgC = '#e4e1e125';
      }
      else {
        this.bgC = '';
      }
    }
  }

  hideSideBarHover() {
    if (!this.isPermanentlyOpen) {
      this.isOpened = false;
      this.s.setSectionLocation(this.isOpened);
      this.bgC = '';
      if (this.sideNav) {
        this.sideNav.nativeElement.classList.remove('open');
      }
    }
  }


}
