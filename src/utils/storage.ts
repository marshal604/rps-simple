import AsyncStorage from "@react-native-async-storage/async-storage";

interface StorageKeys {
  INVENTORY: string;
  SETTINGS: string;
}

interface StorageUtils {
  saveInventory: (inventory: any) => Promise<boolean>;
  loadInventory: () => Promise<any | null>;
  saveSettings: (settings: any) => Promise<boolean>;
  loadSettings: () => Promise<any | null>;
  clearAllData: () => Promise<boolean>;
}

// Storage keys
const KEYS: StorageKeys = {
  INVENTORY: "rps_game_inventory",
  SETTINGS: "rps_game_settings",
};

// Storage utility functions
const storage: StorageUtils = {
  // Save player inventory
  saveInventory: async (inventory: any): Promise<boolean> => {
    try {
      const jsonValue = JSON.stringify(inventory);
      await AsyncStorage.setItem(KEYS.INVENTORY, jsonValue);
      return true;
    } catch (error) {
      console.error("Error saving inventory:", error);
      return false;
    }
  },

  // Load player inventory
  loadInventory: async (): Promise<any | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.INVENTORY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error loading inventory:", error);
      return null;
    }
  },

  // Save game settings
  saveSettings: async (settings: any): Promise<boolean> => {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(KEYS.SETTINGS, jsonValue);
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  },

  // Load game settings
  loadSettings: async (): Promise<any | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error loading settings:", error);
      return null;
    }
  },

  // Clear all game data
  clearAllData: async (): Promise<boolean> => {
    try {
      await AsyncStorage.multiRemove([KEYS.INVENTORY, KEYS.SETTINGS]);
      return true;
    } catch (error) {
      console.error("Error clearing data:", error);
      return false;
    }
  },
};

export default storage;
