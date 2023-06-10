import { APIResponse, request } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

export class DeckApi {
  private async createContext() {
    return await request.newContext({
      baseURL: process.env.BASE_URL,
      ignoreHTTPSErrors: true,
    });
  }

  private async sendRequest(method: "GET" | "POST", endpoint: string) {
    const context = await this.createContext();
    let response: APIResponse;
    if (method === "GET") {
      response = await context.get(endpoint);
    } else {
      response = await context.post(endpoint);
    }
    const responseBody = await response.body();
    return JSON.parse(responseBody.toString());
  }

  async createDeck(method: "GET" | "POST" = "GET", jokersEnabled = false) {
    const endpoint = jokersEnabled
      ? "/api/deck/new/?jokers_enabled=true"
      : "/api/deck/new/";
    return await this.sendRequest(method, endpoint);
  }

  async createShuffledDeck(method: "GET" | "POST" = "GET", deckCount = 1) {
    const endpoint = `/api/deck/new/shuffle/?deck_count=${deckCount}`;
    return await this.sendRequest(method, endpoint);
  }

  async reshuffleDeck(deckId: string, remaining = false) {
    const endpoint = `/api/deck/${deckId}/shuffle/?remaining=${remaining}`;
    return await this.sendRequest("POST", endpoint);
  }

  async drawCards(deckId: string, count: number) {
    const endpoint = `api/deck/${deckId}/draw/?count=${count}`;
    return await this.sendRequest("GET", endpoint);
  }

  async addToPile(deckId: string, pileName: string, cards: string[]) {
    const endpoint = `api/deck/${deckId}/pile/${pileName}/add/?cards=${cards.join(
      ","
    )}`;
    return await this.sendRequest("GET", endpoint);
  }

  async dealCardsToPlayers(deckId: string) {
    const player1Cards = await this.drawCards(deckId, 3);
    const player2Cards = await this.drawCards(deckId, 3);
    const player1Pile = await this.addToPile(
      deckId,
      "player1",
      player1Cards.cards.map((card) => card.code)
    );
    const player2Pile = await this.addToPile(
      deckId,
      "player2",
      player2Cards.cards.map((card) => card.code)
    );
    return { player1Pile, player2Pile };
  }

  async isBlackjack(hand) {
    if (hand.length !== 2) {
      return false;
    }
    let hasAce = false;
    let hasTen = false;
    for (const card of hand) {
      if (card.value === "ACE") {
        hasAce = true;
      }
      if (["10", "KING", "QUEEN", "JACK"].includes(card.value)) {
        hasTen = true;
      }
    }
    return hasAce && hasTen;
  }

  async drawCardsAndCheckBlackjack(deckId: string, numberOfCards: number) {
    const player = await this.drawCardsSafe(deckId, numberOfCards);
    console.log("drawCardsAndCheckBlackjack", player);
    if (!player.success) {
      throw new Error(`Drawing cards failed: ${player}`);
    }
    if (!player.deck_id) {
      throw new Error(`Deck id is not defined: ${player}`);
    }
    if (player.cards.length !== numberOfCards) {
      throw new Error(
        `Expected ${numberOfCards} cards, but got ${player.cards.length}`
      );
    }
    const hasBlackjack = await this.isBlackjack(player.cards);
    return { player, hasBlackjack };
  }

  async drawCardsSafe(deckId: string, count: number) {
    const endpoint = `api/deck/${deckId}/draw/?count=${count}`;
    const responseJSON = await this.sendRequest("GET", endpoint);

    if (
      !responseJSON.success &&
      responseJSON.error === "Not enough cards remaining to draw 2 additional"
    ) {
      await this.reshuffleDeck(deckId);
      return await this.drawCardsSafe(deckId, count);
    }
    return responseJSON;
  }

  checkForBlackjack(
    player1Blackjack: boolean,
    player2Blackjack: boolean
  ): string {
    if (player1Blackjack && player2Blackjack) {
      return "Both players have blackjack!";
    } else if (player1Blackjack) {
      return "Player 1 has blackjack!";
    } else if (player2Blackjack) {
      return "Player 2 has blackjack!";
    } else {
      return "None of the players have blackjack!";
    }
  }
}
