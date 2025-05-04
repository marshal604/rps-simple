import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface OutfitPreviewProps {
  outfit: {
    hair: string;
    top: string;
    bottom: string;
    shoes: string;
    accessory?: string;
  };
  size?: "small" | "medium" | "large";
  isNPC?: boolean;
}

interface OutfitLayerProps {
  itemId: string;
  type: "hair" | "top" | "bottom" | "shoes" | "accessory";
  size: "small" | "medium" | "large";
}

// Helper component to load the correct image based on itemId and type
const OutfitLayer: React.FC<OutfitLayerProps> = ({ itemId, type, size }) => {
  // This is a placeholder - in a real app, you'd have actual images
  // and a proper asset loading system
  const getPlaceholderImage = () => {
    // These would be replaced with actual images
    switch (type) {
      // case "hair":
      //   return require("../../assets/outfits/hair/placeholder.png");
      // case "top":
      //   return require("../../assets/outfits/top/placeholder.png");
      // case "bottom":
      //   return require("../../assets/outfits/bottom/placeholder.png");
      // case "shoes":
      //   return require("../../assets/outfits/shoes/placeholder.png");
      // case "accessory":
      //   return require("../../assets/outfits/accessory/placeholder.png");
      default:
        return require("../../assets/outfits/placeholder.png");
    }
  };

  // For now, using placeholders. In a real app, you'd dynamically load images based on itemId
  // const imageSource = { uri: `path_to_your_assets/${type}/${itemId}.png` };
  const imageSource = getPlaceholderImage();

  return (
    <Image
      source={imageSource}
      style={[styles.layer, getLayerStyle(type, size)]}
      resizeMode="contain"
    />
  );
};

// Helper to get size-based styles for each layer type
const getLayerStyle = (type: string, size: "small" | "medium" | "large") => {
  const sizeMultiplier = size === "small" ? 0.7 : size === "medium" ? 1 : 1.3;

  switch (type) {
    case "hair":
      return {
        width: 150 * sizeMultiplier,
        height: 150 * sizeMultiplier,
        zIndex: 30,
      };
    case "top":
      return {
        width: 150 * sizeMultiplier,
        height: 150 * sizeMultiplier,
        zIndex: 20,
      };
    case "bottom":
      return {
        width: 150 * sizeMultiplier,
        height: 150 * sizeMultiplier,
        zIndex: 10,
      };
    case "shoes":
      return {
        width: 150 * sizeMultiplier,
        height: 150 * sizeMultiplier,
        zIndex: 5,
      };
    case "accessory":
      return {
        width: 150 * sizeMultiplier,
        height: 150 * sizeMultiplier,
        zIndex: 40,
      };
    default:
      return {};
  }
};

const OutfitPreview: React.FC<OutfitPreviewProps> = ({
  outfit,
  size = "medium",
  isNPC = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        size === "small"
          ? styles.smallContainer
          : size === "large"
          ? styles.largeContainer
          : styles.mediumContainer,
        isNPC && styles.npcContainer,
      ]}
    >
      {/* Base character (could be a silhouette or basic body) */}
      <Image
        source={require("../../assets/outfits/placeholder.png")}
        style={[styles.baseCharacter, getLayerStyle("base", size)]}
        resizeMode="contain"
      />

      {/* Outfit layers */}
      <OutfitLayer itemId={outfit.shoes} type="shoes" size={size} />
      <OutfitLayer itemId={outfit.bottom} type="bottom" size={size} />
      <OutfitLayer itemId={outfit.top} type="top" size={size} />
      <OutfitLayer itemId={outfit.hair} type="hair" size={size} />
      {outfit.accessory && (
        <OutfitLayer itemId={outfit.accessory} type="accessory" size={size} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  smallContainer: {
    width: 120,
    height: 200,
  },
  mediumContainer: {
    width: 180,
    height: 300,
  },
  largeContainer: {
    width: 240,
    height: 400,
  },
  npcContainer: {
    transform: [{ scaleX: -1 }], // Flip horizontally for NPC
  },
  baseCharacter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  layer: {
    position: "absolute",
  },
});

export default OutfitPreview;
