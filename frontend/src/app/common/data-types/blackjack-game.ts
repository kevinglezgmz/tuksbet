import { BlackjackPlayer } from "./blackjack-player";
import { Card } from "./card";

export interface BlackjackGame {
    gameDeck?: Card[],
    gameStarted?: boolean,
    userPlaying?: boolean,
    winner?: string,
    dealer?: BlackjackPlayer,
    player?: BlackjackPlayer
}
