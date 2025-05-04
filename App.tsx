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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import RPSPanel from "./src/components/RPSPanel";
import DirectionMatch from "./src/components/DirectionMatch";
import OutfitPreview from "./src/components/OutfitPreview";
import GameScreen from "./src/screens/GameScreen";
import WardrobeScreen from "./src/screens/WardrobeScreen";
import ResultScreen from "./src/screens/ResultScreen";
import { OutfitManager } from "./src/logic/OutfitManager";
import storage from "./src/utils/storage";

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Home screen component
const HomeScreen = ({ navigation }: any) => {
  const [outfitCatalog, setOutfitCatalog] = useState<any>(null);
  const [outfitManager, setOutfitManager] = useState<OutfitManager | null>(
    null
  );
  const [npcs, setNpcs] = useState<any[]>([]);

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
  const startGame = (npcId: string) => {
    if (!outfitManager) return;

    navigation.navigate("Game", {
      npcId,
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

      {/* Player Preview */}
      <View style={styles.playerPreview}>
        <Text style={styles.previewTitle}>你的角色</Text>
        <OutfitPreview
          outfit={outfitManager.getEquippedOutfit()}
          size="medium"
        />
        <Text style={styles.coinsText}>
          金幣: {outfitManager.getInventory().coins}
        </Text>
      </View>

      {/* NPC Selection */}
      <View style={styles.npcSelection}>
        <Text style={styles.sectionTitle}>選擇對手</Text>
        <ScrollView style={styles.npcList}>
          {npcs.map((npc) => (
            <TouchableOpacity
              key={npc.id}
              style={styles.npcItem}
              onPress={() => startGame(npc.id)}
            >
              <View style={styles.npcInfo}>
                <Text style={styles.npcName}>{npc.name}</Text>
                <Text style={styles.npcDescription}>{npc.description}</Text>
              </View>
              <View style={styles.npcPreview}>
                <OutfitPreview outfit={npc.outfit} size="small" isNPC={true} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
          component={GameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
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
  playerPreview: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f8f9fa",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coinsText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff8c00",
  },
  npcSelection: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  npcList: {
    flex: 1,
  },
  npcItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  npcInfo: {
    flex: 2,
    justifyContent: "center",
  },
  npcName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  npcDescription: {
    fontSize: 14,
    color: "#666",
  },
  npcPreview: {
    flex: 1,
    alignItems: "center",
  },
});
