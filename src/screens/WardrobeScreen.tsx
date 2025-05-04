import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CharacterPreview from "../components/CharacterPreview";
import OutfitDetail from "../components/OutfitDetail";
import { OutfitManager } from "../logic/OutfitManager";
import storage from "../utils/storage";
import { OutfitType, OutfitItemType } from "../types/outfit";

interface WardrobeScreenProps {
  route: {
    params: {
      outfitManager: OutfitManager;
    };
  };
}

interface OutfitItem extends OutfitItemType {
  type: string;
}

const WardrobeScreen: React.FC<WardrobeScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { outfitManager } = route.params;

  // State
  const [inventory, setInventory] = useState(outfitManager.getInventory());
  const [currentOutfit, setCurrentOutfit] = useState(
    outfitManager.getEquippedOutfit()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("top");
  const [items, setItems] = useState<OutfitItem[]>([]);

  // 可用的類別
  const availableCategories = [
    "face",
    "eyes",
    "top",
    "bottom",
    "shoes",
    "accessory",
  ];

  // Load items for selected category
  useEffect(() => {
    loadCategoryItems();
  }, [selectedCategory]);

  // Load items for the selected category
  const loadCategoryItems = () => {
    const ownedItems = inventory.owned[selectedCategory] || [];
    const loadedItems: OutfitItem[] = [];

    ownedItems.forEach((itemId) => {
      const details = outfitManager.getOutfitItemDetails(
        selectedCategory,
        itemId
      );
      if (details) {
        loadedItems.push({
          ...details,
          type: selectedCategory,
        });
      }
    });

    setItems(loadedItems);
  };

  // Handle equipping an item
  const handleEquipItem = (itemId: string) => {
    if (outfitManager.equipItem(selectedCategory, itemId)) {
      // Update state
      setCurrentOutfit(outfitManager.getEquippedOutfit());
      // Save to storage
      storage.saveInventory(outfitManager.getInventory());

      Alert.alert("成功", "已裝備選擇的物品");
    } else {
      Alert.alert("錯誤", "無法裝備此物品");
    }
  };

  // Save the current outfit configuration
  const handleSaveOutfit = async () => {
    await storage.saveInventory(outfitManager.getInventory());
    Alert.alert("成功", "已保存目前造型");
  };

  // Render item
  const renderItem = ({ item }: { item: OutfitItem }) => {
    const isEquipped = currentOutfit[item.type] === item.id;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isEquipped && styles.equippedItem]}
        onPress={() => handleEquipItem(item.id)}
      >
        <OutfitDetail item={item} showRarity={true} />
        {isEquipped && <Text style={styles.equippedText}>已裝備</Text>}
      </TouchableOpacity>
    );
  };

  // Helper to get readable category name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case "face":
        return "膚色";
      case "ears":
        return "耳朵";
      case "eyebrows":
        return "眉毛";
      case "eyes":
        return "眼睛";
      case "mouth":
        return "嘴巴";
      case "top":
        return "上衣";
      case "topAccessory":
        return "上衣配件";
      case "bottom":
        return "下身";
      case "bottomAccessory":
        return "下身配件";
      case "socks":
        return "襪子";
      case "shoes":
        return "鞋子";
      case "belt":
        return "皮帶";
      case "handAccessory":
        return "手部配件";
      case "accessory":
        return "配件";
      default:
        return category;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>衣櫃</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveOutfit}>
          <Text style={styles.saveButtonText}>保存造型</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Left: Outfit Preview */}
        <View style={styles.previewContainer}>
          <CharacterPreview outfit={currentOutfit} size="large" />
          <Text style={styles.coinsText}>金幣: {inventory.coins}</Text>
        </View>

        {/* Right: Outfit Selection */}
        <View style={styles.selectionContainer}>
          <ScrollView
            horizontal
            style={styles.categoryScroll}
            showsHorizontalScrollIndicator={false}
          >
            {availableCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText,
                  ]}
                >
                  {getCategoryName(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.itemsList}
            contentContainerStyle={styles.itemsListContent}
            numColumns={2}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>返回</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#eef5ff",
  },
  coinsText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff8c00",
  },
  selectionContainer: {
    flex: 1,
  },
  categoryScroll: {
    maxHeight: 60,
    backgroundColor: "#fff",
  },
  categoryButton: {
    padding: 15,
    marginRight: 5,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeCategoryButton: {
    borderBottomColor: "#007bff",
  },
  categoryText: {
    fontSize: 16,
  },
  activeCategoryText: {
    fontWeight: "bold",
    color: "#007bff",
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    minHeight: 120,
  },
  equippedItem: {
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
    borderWidth: 1,
  },
  equippedText: {
    marginTop: 5,
    color: "#52c41a",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    margin: 15,
    padding: 12,
    backgroundColor: "#6c757d",
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WardrobeScreen;
