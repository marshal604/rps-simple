import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import layers from "../data/layers.json";
import { OutfitType } from "../types/outfit";
import { Asset } from "expo-asset";

const images: Record<string, Record<string, any>> = {
  base: {
    default: Asset.fromModule(require("../../assets/outfits/base/default.png")),
  },
};

interface OutfitProps {
  outfit: OutfitType;
  containerSize?: number;
  defaultImage?: string;
}

export const LayeredCharacter: React.FC<OutfitProps> = ({
  outfit,
  containerSize = 320,
  defaultImage = "default",
}) => {
  // Helper function to get the appropriate image URI
  const getImageSource = (
    part: string,
    filename: string | undefined
  ): ImageSourcePropType => {
    if (!filename) return { uri: "" };

    try {
      // 嘗試從映射表中獲取圖片
      const image = images?.[part]?.[filename];
      return image ? { uri: image.uri } : { uri: "" };
    } catch (error) {
      // 如果有任何錯誤，返回透明圖
      return { uri: "" };
    }
  };

  return (
    <View
      style={[
        styles.container,
        { width: containerSize, height: containerSize },
      ]}
    >
      {layers
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(({ part }) => {
          const filename = outfit[part];

          return (
            <Image
              key={part}
              source={getImageSource(part, filename)}
              style={{
                position: "absolute",
                width: containerSize,
                height: containerSize,
              }}
              resizeMode="contain"
            />
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
});

export default LayeredCharacter;
