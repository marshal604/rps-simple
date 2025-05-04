import { OutfitType, OutfitItemType } from "../types/outfit";

interface Inventory {
  owned: {
    base: string[];
  };
  equipped: OutfitType;
  coins: number;
}

export class OutfitManager {
  private inventory: Inventory;
  private outfitCatalog: Record<string, OutfitItemType[]>;

  constructor(
    initialInventory: Inventory | null,
    outfitCatalog: Record<string, OutfitItemType[]>
  ) {
    // Set default inventory if none provided
    this.inventory = initialInventory || {
      owned: {
        base: ["default"],
      },
      equipped: {
        base: "default",
      },
      coins: 100,
    };

    this.outfitCatalog = outfitCatalog;
  }

  // Get current inventory
  getInventory(): Inventory {
    return JSON.parse(JSON.stringify(this.inventory)); // Return a copy
  }

  // Get current equipped outfit
  getEquippedOutfit(): OutfitType {
    return { ...this.inventory.equipped };
  }

  // Get outfit item details
  getOutfitItemDetails(type: string, id: string): OutfitItemType | undefined {
    const catalog = this.outfitCatalog[type];
    if (!catalog) return undefined;
    return catalog.find((item) => item.id === id);
  }

  // Add item to inventory
  addItemToInventory(type: string, itemId: string): boolean {
    // Check if type exists in inventory
    if (!this.inventory.owned[type as keyof typeof this.inventory.owned]) {
      return false;
    }

    // Check if item exists in catalog
    if (
      !this.outfitCatalog[type] ||
      !this.outfitCatalog[type].some((item) => item.id === itemId)
    ) {
      return false;
    }

    // Check if already owned
    if (
      this.inventory.owned[type as keyof typeof this.inventory.owned].includes(
        itemId
      )
    ) {
      return false;
    }

    // Add to inventory
    this.inventory.owned[type as keyof typeof this.inventory.owned].push(
      itemId
    );
    return true;
  }

  // Equip item
  equipItem(type: string, itemId: string): boolean {
    // Check if type exists
    if (!this.inventory.owned[type as keyof typeof this.inventory.owned]) {
      return false;
    }

    // Check if item is owned
    if (
      !this.inventory.owned[type as keyof typeof this.inventory.owned].includes(
        itemId
      )
    ) {
      return false;
    }

    // Equip item
    this.inventory.equipped[type] = itemId;
    return true;
  }

  // Add coins
  addCoins(amount: number): void {
    this.inventory.coins += amount;
  }

  // Remove coins
  removeCoins(amount: number): boolean {
    if (this.inventory.coins < amount) {
      return false;
    }
    this.inventory.coins -= amount;
    return true;
  }

  // Remove item from inventory
  removeItemFromInventory(type: string, itemId: string): boolean {
    // Check if type exists
    if (!this.inventory.owned[type as keyof typeof this.inventory.owned]) {
      return false;
    }

    // Cannot remove equipped item
    if (this.inventory.equipped[type] === itemId) {
      return false;
    }

    // Find and remove the item
    const index =
      this.inventory.owned[type as keyof typeof this.inventory.owned].indexOf(
        itemId
      );
    if (index === -1) {
      return false;
    }

    this.inventory.owned[type as keyof typeof this.inventory.owned].splice(
      index,
      1
    );
    return true;
  }

  // Handle betting and receiving items
  betItem(type: string, itemId: string): boolean {
    // Check if type exists
    if (!this.inventory.owned[type as keyof typeof this.inventory.owned]) {
      return false;
    }

    // Can't bet equipped items
    if (this.inventory.equipped[type] === itemId) {
      return false;
    }

    // Check if we own the item
    if (
      !this.inventory.owned[type as keyof typeof this.inventory.owned].includes(
        itemId
      )
    ) {
      return false;
    }

    return true;
  }

  // Handle receiving item from a bet win
  receiveItem(type: string, itemId: string): boolean {
    return this.addItemToInventory(type, itemId);
  }
}
