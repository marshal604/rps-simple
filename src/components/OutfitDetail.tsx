import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { OutfitItemType } from "../types/outfit";

interface OutfitDetailProps {
  item: OutfitItemType;
  showRarity?: boolean;
}

const OutfitDetail: React.FC<OutfitDetailProps> = ({
  item,
  showRarity = true,
}) => {
  // 獲取稀有度顏色
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "common":
        return "#a0a0a0";
      case "uncommon":
        return "#2e7d32";
      case "rare":
        return "#1565c0";
      case "epic":
        return "#6a1b9a";
      case "legendary":
        return "#ff6f00";
      default:
        return "#a0a0a0";
    }
  };

  // 獲取稀有度中文名稱
  const getRarityName = (rarity?: string) => {
    switch (rarity) {
      case "common":
        return "普通";
      case "uncommon":
        return "不普通";
      case "rare":
        return "稀有";
      case "epic":
        return "史詩";
      case "legendary":
        return "傳說";
      default:
        return "普通";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.itemName}>{item.name}</Text>

      {showRarity && item.rarity && (
        <View
          style={[
            styles.rarityBadge,
            { backgroundColor: getRarityColor(item.rarity) },
          ]}
        >
          <Text style={styles.rarityText}>{getRarityName(item.rarity)}</Text>
        </View>
      )}

      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    marginVertical: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  rarityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 5,
  },
  rarityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default OutfitDetail;
