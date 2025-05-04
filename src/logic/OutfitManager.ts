interface OutfitItem {
  id: string;
  name: string;
  image: string;
}

interface Outfit {
  hair: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory?: string;
}

interface Inventory {
  owned: {
    hair: string[];
    top: string[];
    bottom: string[];
    shoes: string[];
    accessory: string[];
  };
  equipped: Outfit;
  coins: number;
}

export class OutfitManager {
  private inventory: Inventory;
  private outfitCatalog: {
    hair: OutfitItem[];
    top: OutfitItem[];
    bottom: OutfitItem[];
    shoes: OutfitItem[];
    accessory: OutfitItem[];
  };

  constructor(
    initialInventory: Inventory | null,
    outfitCatalog: {
      hair: OutfitItem[];
      top: OutfitItem[];
      bottom: OutfitItem[];
      shoes: OutfitItem[];
      accessory: OutfitItem[];
    }
  ) {
    // Set default inventory if none provided
    this.inventory = initialInventory || {
      owned: {
        hair: ["hair_1"],
        top: ["top_1"],
        bottom: ["bottom_1"],
        shoes: ["shoes_1"],
        accessory: ["accessory_1"],
      },
      equipped: {
        hair: "hair_1",
        top: "top_1",
        bottom: "bottom_1",
        shoes: "shoes_1",
        accessory: "accessory_1",
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
  getEquippedOutfit(): Outfit {
    return { ...this.inventory.equipped };
  }

  // Get outfit item details
  getOutfitItemDetails(type: keyof Outfit, id: string): OutfitItem | undefined {
    const catalog = this.outfitCatalog[type as keyof typeof this.outfitCatalog];
    return catalog.find((item) => item.id === id);
  }

  // Add item to inventory
  addItemToInventory(type: keyof Outfit, itemId: string): boolean {
    // Check if item exists in catalog
    const exists = this.outfitCatalog[
      type as keyof typeof this.outfitCatalog
    ].some((item) => item.id === itemId);

    if (!exists) {
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
  equipItem(type: keyof Outfit, itemId: string): boolean {
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
  removeItemFromInventory(type: keyof Outfit, itemId: string): boolean {
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
  betItem(type: keyof Outfit, itemId: string): boolean {
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
  receiveItem(type: keyof Outfit, itemId: string): boolean {
    return this.addItemToInventory(type, itemId);
  }
}
