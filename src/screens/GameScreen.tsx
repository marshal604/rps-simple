import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RPSPanel from "../components/RPSPanel";
import DirectionMatch from "../components/DirectionMatch";
import OutfitPreview from "../components/OutfitPreview";
import { GameEngine } from "../logic/GameEngine";
import { OutfitManager } from "../logic/OutfitManager";

interface Bet {
  type: "coins" | "hair" | "top" | "bottom" | "shoes" | "accessory";
  value: string | number;
}

interface GameScreenProps {
  route: {
    params: {
      npcId: string;
      outfitManager: OutfitManager;
    };
  };
}

const GameScreen: React.FC<GameScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { npcId, outfitManager } = route.params;

  // Game state
  const [gamePhase, setGamePhase] = useState<
    "bet" | "rps" | "direction" | "result"
  >("bet");
  const [gameEngine] = useState(new GameEngine());
  const [npc, setNpc] = useState<any>(null);
  const [playerBet, setPlayerBet] = useState<Bet | null>(null);
  const [npcBet, setNpcBet] = useState<Bet | null>(null);
  const [rpsWinner, setRpsWinner] = useState<"player" | "npc" | "draw" | null>(
    null
  );
  const [playerChoice, setPlayerChoice] = useState<
    "rock" | "paper" | "scissors" | null
  >(null);
  const [npcChoice, setNpcChoice] = useState<
    "rock" | "paper" | "scissors" | null
  >(null);
  const [isFirstPlayer, setIsFirstPlayer] = useState<boolean>(false);
  const [playerDirection, setPlayerDirection] = useState<
    "up" | "down" | "left" | "right" | null
  >(null);
  const [npcDirection, setNpcDirection] = useState<
    "up" | "down" | "left" | "right" | null
  >(null);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw" | null>(
    null
  );
  const [showBetModal, setShowBetModal] = useState(false);

  // Load NPC data
  useEffect(() => {
    // In a real app, would fetch from JSON or API
    // For now, just use the first NPC in our mock data
    const mockNpcs = require("../data/npcs.json");
    const selectedNpc =
      mockNpcs.npcs.find((npc: any) => npc.id === npcId) || mockNpcs.npcs[0];
    setNpc(selectedNpc);
  }, [npcId]);

  // Handle player's RPS choice
  const handleRPSChoice = (choice: "rock" | "paper" | "scissors") => {
    if (!npc || !playerBet || !npcBet) return;

    setPlayerChoice(choice);

    // Get NPC choice
    const npcStrategy = npc.rpsStrategy || "random";
    const npcRpsChoice = gameEngine.generateNPCChoice(npcStrategy);
    setNpcChoice(npcRpsChoice);

    // Determine winner
    const winner = gameEngine.determineRPSWinner(choice, npcRpsChoice);
    setRpsWinner(winner);

    if (winner === "draw") {
      // If it's a draw, stay in RPS phase but reset choices after a delay
      setTimeout(() => {
        setPlayerChoice(null);
        setNpcChoice(null);
        setRpsWinner(null);
      }, 2000);
    } else {
      // Move to direction phase
      setTimeout(() => {
        setIsFirstPlayer(winner === "player");
        setGamePhase("direction");
      }, 2000);
    }
  };

  // Handle direction choice
  const handleDirectionChoice = (
    direction: "up" | "down" | "left" | "right"
  ) => {
    if (!npc || !playerBet || !npcBet || !rpsWinner) return;

    if (isFirstPlayer) {
      // Player is first player (RPS winner)
      setPlayerDirection(direction);

      // NPC chooses direction (randomly or opposite)
      const npcDir = gameEngine.generateNPCDirection();
      setNpcDirection(npcDir);

      // Check result
      const result = direction === npcDir ? "win" : "draw";
      setGameResult(result);
    } else {
      // NPC is first player (RPS winner)
      setPlayerDirection(direction);

      // NPC already chose a direction
      const npcDir = gameEngine.generateNPCDirection();
      setNpcDirection(npcDir);

      // Check result
      const result = direction === npcDir ? "lose" : "draw";
      setGameResult(result);
    }

    // Move to result phase
    setTimeout(() => {
      setGamePhase("result");
    }, 2000);
  };

  // Handle bet selection
  const handleBetSelection = (
    type: "coins" | "hair" | "top" | "bottom" | "shoes" | "accessory",
    value: string | number
  ) => {
    setPlayerBet({ type, value });
    setShowBetModal(false);

    // Set NPC bet
    if (npc) {
      const npcBetType =
        npc.betOptions[Math.floor(Math.random() * npc.betOptions.length)];
      let npcBetValue: string | number;

      if (npcBetType === "coins") {
        npcBetValue = 50;
      } else {
        npcBetValue = npc.outfit[npcBetType];
      }

      setNpcBet({ type: npcBetType, value: npcBetValue });
    }

    // Move to RPS phase
    setGamePhase("rps");
  };

  // Prepare bet options
  const getBetOptions = () => {
    const inventory = outfitManager.getInventory();

    const options = [{ type: "coins", value: 50, label: "50 金幣" }];

    // Add outfit options (excluding equipped items)
    Object.entries(inventory.owned).forEach(([type, items]) => {
      if (type !== "accessory" && Array.isArray(items)) {
        items.forEach((itemId) => {
          if (
            itemId !==
            inventory.equipped[type as keyof typeof inventory.equipped]
          ) {
            const itemDetails = outfitManager.getOutfitItemDetails(
              type as any,
              itemId
            );
            if (itemDetails) {
              options.push({
                type,
                value: itemId,
                label: `${itemDetails.name} (${type})`,
              });
            }
          }
        });
      }
    });

    return options;
  };

  // Process game results
  const processGameResults = () => {
    if (!gameResult || !playerBet || !npcBet) return;

    if (gameResult === "win") {
      // Player wins, get NPC bet
      if (npcBet.type === "coins") {
        outfitManager.addCoins(npcBet.value as number);
        Alert.alert("獲勝！", `你贏得了 ${npcBet.value} 金幣！`);
      } else {
        outfitManager.receiveItem(npcBet.type, npcBet.value as string);
        Alert.alert("獲勝！", `你贏得了 NPC 的 ${npcBet.type} 物品！`);
      }
    } else if (gameResult === "lose") {
      // Player loses, give up bet
      if (playerBet.type === "coins") {
        outfitManager.removeCoins(playerBet.value as number);
        Alert.alert("失敗！", `你失去了 ${playerBet.value} 金幣！`);
      } else {
        outfitManager.removeItemFromInventory(
          playerBet.type,
          playerBet.value as string
        );
        Alert.alert("失敗！", `你失去了你的 ${playerBet.type} 物品！`);
      }
    } else {
      // Draw, no change
      Alert.alert("平手！", "雙方都保留自己的物品。");
    }

    // Reset game and go back to bet phase
    resetGame();
  };

  // Reset game
  const resetGame = () => {
    setGamePhase("bet");
    setPlayerBet(null);
    setNpcBet(null);
    setRpsWinner(null);
    setPlayerChoice(null);
    setNpcChoice(null);
    setIsFirstPlayer(false);
    setPlayerDirection(null);
    setNpcDirection(null);
    setGameResult(null);
  };

  // Return to main menu
  const handleBackToMenu = () => {
    navigation.goBack();
  };

  // Render empty state while loading
  if (!npc) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  // Render bet modal
  const renderBetModal = () => (
    <Modal visible={showBetModal} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>選擇賭注</Text>
          <FlatList
            data={getBetOptions()}
            keyExtractor={(item, index) => `bet-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.betOption}
                onPress={() => handleBetSelection(item.type as any, item.value)}
              >
                <Text style={styles.betOptionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowBetModal(false)}
          >
            <Text style={styles.closeButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* NPC Info */}
      <View style={styles.npcContainer}>
        <Text style={styles.npcName}>{npc.name}</Text>
        <Text style={styles.npcDescription}>{npc.description}</Text>

        {npcChoice && (
          <View style={styles.choiceContainer}>
            <Text style={styles.choiceText}>
              NPC選擇:{" "}
              {npcChoice === "rock"
                ? "石頭"
                : npcChoice === "paper"
                ? "布"
                : "剪刀"}
            </Text>
          </View>
        )}

        {npcBet && (
          <View style={styles.betInfoContainer}>
            <Text style={styles.betInfoText}>
              NPC 賭注:{" "}
              {npcBet.type === "coins"
                ? `${npcBet.value} 金幣`
                : `${npcBet.type} 物品`}
            </Text>
          </View>
        )}
      </View>

      {/* Game Arena */}
      <View style={styles.gameArena}>
        <View style={styles.characterContainer}>
          {/* Left: Player */}
          <View style={styles.playerContainer}>
            <OutfitPreview
              outfit={outfitManager.getEquippedOutfit()}
              size="medium"
            />
            {playerChoice && (
              <View style={styles.choiceContainer}>
                <Text style={styles.choiceText}>
                  你選擇:{" "}
                  {playerChoice === "rock"
                    ? "石頭"
                    : playerChoice === "paper"
                    ? "布"
                    : "剪刀"}
                </Text>
              </View>
            )}
            {playerBet && (
              <View style={styles.betInfoContainer}>
                <Text style={styles.betInfoText}>
                  你的賭注:{" "}
                  {playerBet.type === "coins"
                    ? `${playerBet.value} 金幣`
                    : `${playerBet.type} 物品`}
                </Text>
              </View>
            )}
          </View>

          {/* Right: NPC */}
          <View style={styles.npcPreviewContainer}>
            <OutfitPreview outfit={npc.outfit} size="medium" isNPC={true} />
          </View>
        </View>

        {/* Game Phase UI */}
        <View style={styles.gamePhaseContainer}>
          {gamePhase === "bet" && (
            <View>
              <Text style={styles.phaseTitle}>下注階段</Text>
              <TouchableOpacity
                style={styles.betButton}
                onPress={() => setShowBetModal(true)}
              >
                <Text style={styles.betButtonText}>選擇賭注</Text>
              </TouchableOpacity>
            </View>
          )}

          {gamePhase === "rps" && (
            <View>
              <Text style={styles.phaseTitle}>剪刀石頭布階段</Text>
              <RPSPanel
                onChoiceSelected={handleRPSChoice}
                disabled={!!playerChoice}
              />

              {rpsWinner && (
                <Text style={styles.resultText}>
                  {rpsWinner === "player"
                    ? "你贏了這回合！"
                    : rpsWinner === "npc"
                    ? "NPC贏了這回合！"
                    : "平手！再來一次"}
                </Text>
              )}
            </View>
          )}

          {gamePhase === "direction" && (
            <View>
              <Text style={styles.phaseTitle}>黑白配階段</Text>
              <DirectionMatch
                onDirectionSelected={handleDirectionChoice}
                isFirstPlayer={isFirstPlayer}
                disabled={!!playerDirection}
              />

              {playerDirection && npcDirection && (
                <Text style={styles.resultText}>
                  你選擇:{" "}
                  {playerDirection === "up"
                    ? "上"
                    : playerDirection === "down"
                    ? "下"
                    : playerDirection === "left"
                    ? "左"
                    : "右"}
                  {"\n"}
                  NPC選擇:{" "}
                  {npcDirection === "up"
                    ? "上"
                    : npcDirection === "down"
                    ? "下"
                    : npcDirection === "left"
                    ? "左"
                    : "右"}
                </Text>
              )}
            </View>
          )}

          {gamePhase === "result" && (
            <View>
              <Text style={styles.phaseTitle}>遊戲結果</Text>
              <Text
                style={[
                  styles.finalResultText,
                  gameResult === "win"
                    ? styles.winText
                    : gameResult === "lose"
                    ? styles.loseText
                    : styles.drawText,
                ]}
              >
                {gameResult === "win"
                  ? "你贏了！"
                  : gameResult === "lose"
                  ? "你輸了！"
                  : "平手！"}
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={processGameResults}
              >
                <Text style={styles.continueButtonText}>繼續</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleBackToMenu}>
          <Text style={styles.menuButtonText}>返回主選單</Text>
        </TouchableOpacity>
      </View>

      {/* Bet Modal */}
      {renderBetModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
  npcContainer: {
    padding: 15,
    backgroundColor: "#e8f4ff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  npcName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  npcDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  gameArena: {
    flex: 1,
    padding: 15,
  },
  characterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  playerContainer: {
    alignItems: "center",
  },
  npcPreviewContainer: {
    alignItems: "center",
  },
  choiceContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  choiceText: {
    fontSize: 14,
  },
  betInfoContainer: {
    marginTop: 5,
    padding: 8,
    backgroundColor: "#ffe8d6",
    borderRadius: 5,
  },
  betInfoText: {
    fontSize: 12,
    color: "#995500",
  },
  gamePhaseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  resultText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
  finalResultText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  winText: {
    color: "green",
  },
  loseText: {
    color: "red",
  },
  drawText: {
    color: "orange",
  },
  betButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignSelf: "center",
  },
  betButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignSelf: "center",
  },
  continueButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  controlsContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  menuButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
  },
  menuButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  betOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  betOptionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#dc3545",
    fontWeight: "bold",
  },
});

export default GameScreen;
