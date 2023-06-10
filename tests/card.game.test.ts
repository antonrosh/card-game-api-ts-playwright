import { expect, test } from "@playwright/test";
import { DeckApi } from "./../api/deck.api";

test.describe("The Card Game API Testing", () => {
  const deckApi = new DeckApi();

  /**
   * Test Case: The Card Game is up
   * Step 1: Verify The Card Game returns status code 200
   * Step 2: Get new deck without shuffle, response body deck_id is defined
   */
  test("Test Case: The Card Game is up", async ({ request }) => {
    let newDeck;
    await test.step("Step 1: Verify The Card Game returns status code 200", async () => {
      const response = await request.get("/");
      expect(response.status()).toBe(200);
    });
    await test.step("Step 2: Get new deck without shuffle, response body deck_id is defined", async () => {
      newDeck = await deckApi.createDeck();
      expect(newDeck.success).toBe(true);
      expect(newDeck.deck_id).toBeDefined();
    });
  });

  /**
   * Test Case: The Card Game Exercise - Scenario 1
   * Step 1: Get a new deck with shuffle - Verify the deck_id is defined
   * Step 2: Shuffle it - Reshuffle the deck and verify the deck_id is the same
   * Step 3: Deal three cards to each of two players
   * Step 4: Check whether either has blackjack
   * Step 5: If either has, write out which one does
   */
  test("Test Case: The Card Game Exercise - Scenario 1", async () => {
    let newShuffledDeck;
    let player1;
    let player2;
    let player1Blackjack;
    let player2Blackjack;
    await test.step("Step 1: Get a new deck with shuffle - Verify the deck_id is defined", async () => {
      newShuffledDeck = await deckApi.createShuffledDeck("GET", 1);
      expect(newShuffledDeck.success).toBe(true);
      expect(newShuffledDeck.deck_id).toBeDefined();
    });

    await test.step("Step 2: Shuffle it - Reshuffle the deck and verify the deck_id is the same", async () => {
      const shuffleDeck = await deckApi.reshuffleDeck(newShuffledDeck.deck_id);
      expect(shuffleDeck.success).toBe(true);
      expect(shuffleDeck.deck_id).toBeDefined();
      expect(shuffleDeck.deck_id).toBe(newShuffledDeck.deck_id);
    });

    await test.step("Step 3: Deal three cards to each of two players", async () => {
      const numberOfCards = 3;
      player1 = await deckApi.drawCards(newShuffledDeck.deck_id, numberOfCards);
      expect(player1.success).toBe(true);
      expect(player1.deck_id).toBeDefined();
      expect(player1.cards.length).toBe(numberOfCards);

      player2 = await deckApi.drawCards(newShuffledDeck.deck_id, numberOfCards);
      expect(player2.success).toBe(true);
      expect(player2.deck_id).toBeDefined();
      expect(player2.cards.length).toBe(numberOfCards);
    });

    await test.step("Step 4: Check whether either has blackjack", async () => {
      player1Blackjack = await deckApi.isBlackjack(player1.cards);
      player2Blackjack = await deckApi.isBlackjack(player2.cards);
    });

    await test.step("Step 5: If either has, write out which one does", async () => {
      const result = deckApi.checkForBlackjack(
        player1Blackjack,
        player2Blackjack
      );
      console.log(result);
    });
  });

  /**
   * Test Case: The Card Game Exercise - Scenario 2
   * Step 1: Get a new deck with shuffle - Verify the deck_id is defined
   * Step 2: Shuffle it - Reshuffle the deck and verify the deck_id is the same
   * Step 3: Deal two cards to each of two players until one has blackjack
   * Step 4: If either has, write out which one does
   */
  test("Test Case: The Card Game Exercise - Scenario 2", async () => {
    let newShuffledDeck;
    let player1;
    let player2;
    let player1Blackjack;
    let player2Blackjack;
    await test.step("Step 1: Get a new deck with shuffle - Verify the deck_id is defined", async () => {
      newShuffledDeck = await deckApi.createShuffledDeck("GET", 1);
      expect(newShuffledDeck.success).toBe(true);
      expect(newShuffledDeck.deck_id).toBeDefined();
    });

    await test.step("Step 2: Shuffle it - Reshuffle the deck and verify the deck_id is the same", async () => {
      const shuffleDeck = await deckApi.reshuffleDeck(newShuffledDeck.deck_id);
      expect(shuffleDeck.success).toBe(true);
      expect(shuffleDeck.deck_id).toBeDefined();
      expect(shuffleDeck.deck_id).toBe(newShuffledDeck.deck_id);
    });
    await test.step("Step 3: Deal two cards to each of two players until one has blackjack", async () => {
      let numberOfCards = 2;
      do {
        ({ player: player1, hasBlackjack: player1Blackjack } =
          await deckApi.drawCardsAndCheckBlackjack(
            newShuffledDeck.deck_id,
            numberOfCards
          ));
        ({ player: player2, hasBlackjack: player2Blackjack } =
          await deckApi.drawCardsAndCheckBlackjack(
            newShuffledDeck.deck_id,
            numberOfCards
          ));
      } while (!player1Blackjack && !player2Blackjack);
    });
    await test.step("Step 4: If either has, write out which one does", async () => {
      const result = deckApi.checkForBlackjack(
        player1Blackjack,
        player2Blackjack
      );
      console.log(result);
    });
  });
});
