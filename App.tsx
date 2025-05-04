import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import RPSPanel from "./src/components/RPSPanel";
import DirectionMatch from "./src/components/DirectionMatch";
import GameScreen from "./src/screens/GameScreen";
import WardrobeScreen from "./src/screens/WardrobeScreen";
import ResultScreen from "./src/screens/ResultScreen";
import { OutfitManager } from "./src/logic/OutfitManager";
import storage from "./src/utils/storage";
import CharacterPreview from "./src/components/CharacterPreview";
import { OutfitType } from "./src/types/outfit";

// Get screen width for better sizing
const { width } = Dimensions.get("window");

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Define NPC type
interface NPC {
  id: string;
  name: string;
  description: string;
  outfit: OutfitType;
  betOptions: string[];
  personality: string;
  rpsStrategy: "random" | "pattern";
}

// Home screen component
const HomeScreen = ({ navigation }: any) => {
  const [outfitCatalog, setOutfitCatalog] = useState<any>(null);
  const [outfitManager, setOutfitManager] = useState<OutfitManager | null>(
    null
  );
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load game data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load outfits
        const outfits = require("./src/data/outfits.json");
        setOutfitCatalog(outfits);

        // Load NPCs
        const npcData = require("./src/data/npcs.json");
        setNpcs(npcData.npcs);
        // Set the first NPC as selected by default
        if (npcData.npcs.length > 0) {
          setSelectedNpc(npcData.npcs[0]);
        }

        // Load player inventory
        const savedInventory = await storage.loadInventory();

        // Create outfit manager
        const manager = new OutfitManager(savedInventory, outfits);
        setOutfitManager(manager);
      } catch (error) {
        console.error("Error loading game data:", error);
      }
    };

    loadData();
  }, []);

  // Start game with selected NPC
  const startGame = () => {
    if (!outfitManager || !selectedNpc) return;

    navigation.navigate("Game", {
      npcId: selectedNpc.id,
      outfitManager,
    });
  };

  // Open wardrobe
  const openWardrobe = () => {
    if (!outfitManager) return;

    navigation.navigate("Wardrobe", {
      outfitManager,
    });
  };

  // Select an NPC
  const selectNpc = (npc: NPC, index: number) => {
    setSelectedNpc(npc);
    setSelectedIndex(index);
  };

  // If data is still loading
  if (!outfitCatalog || !outfitManager || npcs.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>載入遊戲中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>猜拳穿搭大對決</Text>
        <TouchableOpacity style={styles.wardrobeButton} onPress={openWardrobe}>
          <Text style={styles.wardrobeButtonText}>衣櫃</Text>
        </TouchableOpacity>
      </View>

      {/* Opponent area - fixed height for stability */}
      <View style={styles.opponentArea}>
        <Text style={styles.sectionTitle}>選擇對手</Text>

        {/* NPC carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(
              event.nativeEvent.contentOffset.x / width + 0.5
            );
            if (npcs[index]) {
              setSelectedNpc(npcs[index]);
              setSelectedIndex(index);
            }
          }}
        >
          {npcs.map((npc) => (
            <View key={npc.id} style={styles.npcCarouselItem}>
              <Text style={styles.npcCarouselName}>{npc.name}</Text>
              <View style={styles.characterContainer}>
                <CharacterPreview
                  outfit={npc.outfit}
                  size="medium"
                  flipHorizontal={true}
                  showName={false}
                />
              </View>
              <Text style={styles.npcCarouselDescription}>
                {npc.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* NPC Selection Indicators */}
        <View style={styles.npcIndicators}>
          {npcs.map((npc, index) => (
            <TouchableOpacity
              key={npc.id}
              style={[
                styles.npcIndicator,
                selectedIndex === index && styles.npcIndicatorSelected,
              ]}
              onPress={() => selectNpc(npc, index)}
            />
          ))}
        </View>

        {/* Battle Button */}
        <TouchableOpacity style={styles.battleButton} onPress={startGame}>
          <Text style={styles.battleButtonText}>開始對戰</Text>
        </TouchableOpacity>
      </View>

      {/* Player Preview (at the bottom) */}
      <View style={styles.playerPreview}>
        <View style={styles.playerHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.previewTitle}>你的角色</Text>
          </View>
          <Text style={styles.coinsText}>
            金幣: {outfitManager.getInventory().coins}
          </Text>
        </View>
        <CharacterPreview
          outfit={outfitManager.getEquippedOutfit()}
          size="medium"
        />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen as any}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Wardrobe"
          component={WardrobeScreen as any}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen as any}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  wardrobeButton: {
    backgroundColor: "#17a2b8",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  wardrobeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  opponentArea: {
    height: 450, // Fixed height to prevent layout issues
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  carouselContent: {
    alignItems: "center",
  },
  npcCarouselItem: {
    width: width - 30, // Adjust for padding
    alignItems: "center",
  },
  characterContainer: {
    height: 200, // Fixed height for character preview
    justifyContent: "center",
    alignItems: "center",
  },
  npcCarouselName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  npcCarouselDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 28,
    paddingHorizontal: 20,
  },
  npcIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  npcIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  npcIndicatorSelected: {
    backgroundColor: "#17a2b8",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  battleButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  battleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  playerPreview: {
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f8f9fa",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  coinsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff8c00",
    position: "absolute",
    right: 0,
  },
});
