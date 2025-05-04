import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import OutfitPreview from "../components/OutfitPreview";
import { OutfitManager } from "../logic/OutfitManager";

interface ResultScreenProps {
  route: {
    params: {
      result: "win" | "lose" | "draw";
      outfitManager: OutfitManager;
      playerReward?: {
        type: "coins" | "hair" | "top" | "bottom" | "shoes" | "accessory";
        value: string | number;
      };
      npcId: string;
    };
  };
}

const ResultScreen: React.FC<ResultScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { result, outfitManager, playerReward, npcId } = route.params;

  // Animation values
  const titleScale = new Animated.Value(0.5);
  const rewardOpacity = new Animated.Value(0);

  // Start animations on load
  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleScale, {
        toValue: 1.2,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(titleScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(rewardOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Return to main menu
  const handleBackToMenu = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" as never }],
    });
  };

  // Continue to next match
  const handleNextMatch = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Game" as never, params: { npcId, outfitManager } }],
    });
  };

  // Go to wardrobe
  const handleGoToWardrobe = () => {
    navigation.navigate("Wardrobe" as never, { outfitManager } as never);
  };

  // Get reward display name
  const getRewardDisplayName = () => {
    if (!playerReward) return "";

    if (playerReward.type === "coins") {
      return `${playerReward.value} 金幣`;
    } else {
      const itemDetails = outfitManager.getOutfitItemDetails(
        playerReward.type,
        playerReward.value as string
      );
      return itemDetails
        ? `${itemDetails.name} (${getCategoryName(playerReward.type)})`
        : "獎勵物品";
    }
  };

  // Get category display name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case "hair":
        return "髮型";
      case "top":
        return "上衣";
      case "bottom":
        return "下身";
      case "shoes":
        return "鞋子";
      case "accessory":
        return "配件";
      default:
        return category;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View
        style={[
          styles.background,
          result === "win"
            ? styles.winBackground
            : result === "lose"
            ? styles.loseBackground
            : styles.drawBackground,
        ]}
      />

      {/* Title */}
      <Animated.Text
        style={[
          styles.resultTitle,
          result === "win"
            ? styles.winTitle
            : result === "lose"
            ? styles.loseTitle
            : styles.drawTitle,
          { transform: [{ scale: titleScale }] },
        ]}
      >
        {result === "win" ? "勝利！" : result === "lose" ? "失敗..." : "平手"}
      </Animated.Text>

      {/* Reward display for win */}
      {result === "win" && playerReward && (
        <Animated.View
          style={[styles.rewardContainer, { opacity: rewardOpacity }]}
        >
          <Text style={styles.rewardTitle}>獲得獎勵</Text>
          <View style={styles.rewardCard}>
            <Text style={styles.rewardName}>{getRewardDisplayName()}</Text>

            {playerReward.type !== "coins" && (
              <OutfitPreview
                outfit={{
                  hair:
                    playerReward.type === "hair"
                      ? (playerReward.value as string)
                      : "hair_1",
                  top:
                    playerReward.type === "top"
                      ? (playerReward.value as string)
                      : "top_1",
                  bottom:
                    playerReward.type === "bottom"
                      ? (playerReward.value as string)
                      : "bottom_1",
                  shoes:
                    playerReward.type === "shoes"
                      ? (playerReward.value as string)
                      : "shoes_1",
                  accessory:
                    playerReward.type === "accessory"
                      ? (playerReward.value as string)
                      : "accessory_1",
                }}
                size="small"
              />
            )}

            {playerReward.type === "coins" && (
              <Text style={styles.coinsReward}>+{playerReward.value}</Text>
            )}
          </View>
        </Animated.View>
      )}

      {/* Message for lose */}
      {result === "lose" && (
        <Animated.View
          style={[styles.loseMessageContainer, { opacity: rewardOpacity }]}
        >
          <Text style={styles.loseMessage}>不要氣餒！再接再厲！</Text>
        </Animated.View>
      )}

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleBackToMenu}>
          <Text style={styles.buttonText}>返回主選單</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextMatch}>
          <Text style={styles.buttonText}>下一場對戰</Text>
        </TouchableOpacity>

        {result === "win" && playerReward && playerReward.type !== "coins" && (
          <TouchableOpacity
            style={styles.wardrobeButton}
            onPress={handleGoToWardrobe}
          >
            <Text style={styles.buttonText}>前往衣櫃</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  winBackground: {
    backgroundColor: "#d4edda",
  },
  loseBackground: {
    backgroundColor: "#f8d7da",
  },
  drawBackground: {
    backgroundColor: "#fff3cd",
  },
  resultTitle: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 40,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  winTitle: {
    color: "#28a745",
  },
  loseTitle: {
    color: "#dc3545",
  },
  drawTitle: {
    color: "#ffc107",
  },
  rewardContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  rewardCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coinsReward: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff8c00",
  },
  loseMessageContainer: {
    marginBottom: 40,
  },
  loseMessage: {
    fontSize: 20,
    color: "#6c757d",
    textAlign: "center",
  },
  controlsContainer: {
    width: "80%",
  },
  menuButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  wardrobeButton: {
    backgroundColor: "#17a2b8",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ResultScreen;
