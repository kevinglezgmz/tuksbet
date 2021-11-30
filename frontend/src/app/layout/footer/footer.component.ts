import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Game } from 'src/app/common/data-types/game';
import { GameService } from 'src/app/common/services/game.service';

const facebookLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg';
const twitterLogoURL = 'https://upload.wikimedia.org/wikipedia/fr/c/c8/Twitter_Bird.svg';
const instaLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Instagram_simple_icon.svg';
const discordLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Discord_color_D.svg';
const youtubeLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/7/72/YouTube_social_white_square_%282017%29.svg';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  games: Game[] = [];
  constructor(
    private gameService: GameService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl(facebookLogoURL));
    this.matIconRegistry.addSvgIcon('twitter', this.domSanitizer.bypassSecurityTrustResourceUrl(twitterLogoURL));
    this.matIconRegistry.addSvgIcon('insta', this.domSanitizer.bypassSecurityTrustResourceUrl(instaLogoURL));
    this.matIconRegistry.addSvgIcon('discord', this.domSanitizer.bypassSecurityTrustResourceUrl(discordLogoURL));
    this.matIconRegistry.addSvgIcon('youtube', this.domSanitizer.bypassSecurityTrustResourceUrl(youtubeLogoURL));
  }

  ngOnInit(): void {
    this.gameService.getAllGames().then((games: Game[]) => {
      this.games = games;
    });
  }
}
