/**
 * 服裝項目的類型定義
 */
export interface OutfitItemType {
  id: string;
  name: string;
  description?: string;
  image: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

/**
 * 完整角色裝備的類型定義
 */
export interface OutfitType {
  face?: string;
  ears?: string;
  eyebrows?: string;
  eyes?: string;
  mouth?: string;
  top?: string;
  topAccessory?: string;
  bottom?: string;
  bottomAccessory?: string;
  socks?: string;
  shoes?: string;
  belt?: string;
  handAccessory?: string;
  accessory?: string;
  [key: string]: string | undefined;
}
