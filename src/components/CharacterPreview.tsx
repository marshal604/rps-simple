import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LayeredCharacter from "./LayeredCharacter";
import { OutfitType } from "../types/outfit";

interface CharacterPreviewProps {
  outfit: OutfitType;
  characterName?: string;
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  flipHorizontal?: boolean;
  showName?: boolean;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  outfit,
  characterName,
  size = "medium",
  onPress,
  flipHorizontal = false,
  showName = true,
}) => {
  // 基於尺寸設定容器大小
  const getSizeValue = (): number => {
    switch (size) {
      case "small":
        return 160;
      case "medium":
        return 240;
      case "large":
        return 320;
      default:
        return 240;
    }
  };

  const containerSize = getSizeValue();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.characterContainer,
          flipHorizontal && styles.flippedContainer,
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        <LayeredCharacter outfit={outfit} containerSize={containerSize} />

        {showName && characterName && (
          <Text style={styles.nameText}>{characterName}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  characterContainer: {
    alignItems: "center",
  },
  flippedContainer: {
    transform: [{ scaleX: -1 }],
  },
  nameText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CharacterPreview;
