import { Card } from "./card";

export interface BlackjackPlayer {
    score?: number,
    hiddenScore?: number,
    cards?: Card[],
    hiddenCard?: Card
}
