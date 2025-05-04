interface RPSChoice {
  id: "rock" | "paper" | "scissors";
  beats: "rock" | "paper" | "scissors";
}

interface DirectionChoice {
  id: "up" | "down" | "left" | "right";
  opposite: "up" | "down" | "left" | "right";
}

interface GameResult {
  winner: "player" | "npc" | "draw";
  playerChoice?: "rock" | "paper" | "scissors";
  npcChoice?: "rock" | "paper" | "scissors";
  playerDirection?: "up" | "down" | "left" | "right";
  npcDirection?: "up" | "down" | "left" | "right";
}

interface Bet {
  type: "coins" | "hair" | "top" | "bottom" | "shoes" | "accessory";
  value: string | number;
}

// Game constants
const RPS_CHOICES: RPSChoice[] = [
  { id: "rock", beats: "scissors" },
  { id: "paper", beats: "rock" },
  { id: "scissors", beats: "paper" },
];

const DIRECTIONS: DirectionChoice[] = [
  { id: "up", opposite: "down" },
  { id: "down", opposite: "up" },
  { id: "left", opposite: "right" },
  { id: "right", opposite: "left" },
];

export class GameEngine {
  // Determine RPS winner
  determineRPSWinner(
    playerChoice: "rock" | "paper" | "scissors",
    npcChoice: "rock" | "paper" | "scissors"
  ): "player" | "npc" | "draw" {
    if (playerChoice === npcChoice) {
      return "draw";
    }

    const playerChoiceObj = RPS_CHOICES.find(
      (choice) => choice.id === playerChoice
    );

    if (playerChoiceObj && playerChoiceObj.beats === npcChoice) {
      return "player";
    } else {
      return "npc";
    }
  }

  // Generate NPC choice based on strategy
  generateNPCChoice(
    strategy: "random" | "pattern"
  ): "rock" | "paper" | "scissors" {
    if (strategy === "random") {
      const choices: ("rock" | "paper" | "scissors")[] = [
        "rock",
        "paper",
        "scissors",
      ];
      const randomIndex = Math.floor(Math.random() * choices.length);
      return choices[randomIndex];
    } else {
      // Simple pattern: more likely to choose rock
      const randomValue = Math.random();
      if (randomValue < 0.5) {
        return "rock";
      } else if (randomValue < 0.75) {
        return "paper";
      } else {
        return "scissors";
      }
    }
  }

  // Direction match (Black & White game)
  determineDirectionMatchWinner(
    firstPlayerDirection: "up" | "down" | "left" | "right",
    secondPlayerDirection: "up" | "down" | "left" | "right",
    rpsWinner: "player" | "npc"
  ): "player" | "npc" | "draw" {
    // If directions are the same, the first player (RPS winner) wins
    if (firstPlayerDirection === secondPlayerDirection) {
      return rpsWinner;
    } else {
      // If directions are different, it's a draw
      return "draw";
    }
  }

  // Generate random NPC direction
  generateNPCDirection(): "up" | "down" | "left" | "right" {
    const directions: ("up" | "down" | "left" | "right")[] = [
      "up",
      "down",
      "left",
      "right",
    ];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  }

  // Get opposite direction
  getOppositeDirection(
    direction: "up" | "down" | "left" | "right"
  ): "up" | "down" | "left" | "right" {
    const dirObj = DIRECTIONS.find((dir) => dir.id === direction);
    return dirObj ? dirObj.opposite : "down"; // Default to down if not found
  }

  // Full game flow
  playGame(
    playerRPSChoice: "rock" | "paper" | "scissors",
    npcStrategy: "random" | "pattern",
    playerBet: Bet,
    npcBet: Bet
  ): {
    gamePhase: "rps" | "direction" | "complete";
    result?: GameResult;
    rpsWinner?: "player" | "npc" | "draw";
    firstPlayerDirection?: "up" | "down" | "left" | "right";
    playerWins?: boolean;
    playerReward?: Bet;
  } {
    // Step 1: RPS phase
    const npcRPSChoice = this.generateNPCChoice(npcStrategy);
    const rpsWinner = this.determineRPSWinner(playerRPSChoice, npcRPSChoice);

    // If it's a draw, end game and restart
    if (rpsWinner === "draw") {
      return {
        gamePhase: "complete",
        result: {
          winner: "draw",
          playerChoice: playerRPSChoice,
          npcChoice: npcRPSChoice,
        },
      };
    }

    // Continue to direction phase
    return {
      gamePhase: "direction",
      rpsWinner,
      result: {
        winner: rpsWinner,
        playerChoice: playerRPSChoice,
        npcChoice: npcRPSChoice,
      },
    };
  }

  // Direction phase
  playDirectionPhase(
    rpsWinner: "player" | "npc",
    firstPlayerDirection: "up" | "down" | "left" | "right",
    secondPlayerDirection: "up" | "down" | "left" | "right",
    playerBet: Bet,
    npcBet: Bet
  ): {
    gamePhase: "complete";
    result: GameResult;
    playerWins: boolean;
    playerReward?: Bet;
  } {
    const finalWinner = this.determineDirectionMatchWinner(
      firstPlayerDirection,
      secondPlayerDirection,
      rpsWinner
    );

    // If it's a draw, return to RPS phase
    if (finalWinner === "draw") {
      return {
        gamePhase: "complete",
        result: {
          winner: "draw",
          playerDirection:
            rpsWinner === "player"
              ? firstPlayerDirection
              : secondPlayerDirection,
          npcDirection:
            rpsWinner === "npc" ? firstPlayerDirection : secondPlayerDirection,
        },
        playerWins: false,
      };
    }

    // Game complete with winner
    const playerWins = finalWinner === "player";

    return {
      gamePhase: "complete",
      result: {
        winner: finalWinner,
        playerDirection:
          rpsWinner === "player" ? firstPlayerDirection : secondPlayerDirection,
        npcDirection:
          rpsWinner === "npc" ? firstPlayerDirection : secondPlayerDirection,
      },
      playerWins,
      playerReward: playerWins ? npcBet : undefined,
    };
  }
}
