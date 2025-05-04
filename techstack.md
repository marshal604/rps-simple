# 📦 Guess & Style MVP - 專案結構說明

## 🧱 技術簡介

- 技術：React Native + Expo
- 儲存方式：AsyncStorage（本機）
- 廣告系統：AdMob（插頁 + 獎勵）
- 模式：單機對戰、模組化服裝換裝

---

## 📁 專案結構總覽

```
src/
├── components/
│   ├── RPSPanel.tsx              # 猜拳面板，顯示並處理玩家出拳行為
│   ├── DirectionMatch.tsx        # 黑白配方向選擇 UI + 邏輯處理
│   └── OutfitPreview.tsx         # 顯示角色目前穿搭的圖層組合
│
├── screens/
│   ├── GameScreen.tsx            # 主對戰畫面：猜拳、黑白配、下注
│   ├── ResultScreen.tsx          # 結果畫面：勝負判定、獎勵結算
│   └── WardrobeScreen.tsx        # 衣櫃畫面：服裝清單、裝備切換
│
├── data/
│   ├── npcs.json                 # 所有關卡 NPC 的資料：姓名、個性、服裝、下注選項
│   └── outfits.json              # 可穿戴的所有服裝部件清單
│
├── logic/
│   ├── GameEngine.ts             # 對戰邏輯核心（猜拳勝負 + 黑白配邏輯 + 結算）
│   └── OutfitManager.ts          # 處理服裝資料、擁有狀態與裝備管理
│
├── utils/
│   └── storage.ts                # AsyncStorage 存取包裝，儲存玩家資料與設定
│
assets/
└── outfits/
    ├── hair/                     # 髮型圖層 PNG（透明背景）
    ├── top/                      # 上衣圖層 PNG
    ├── bottom/                   # 下身圖層 PNG
    ├── shoes/                    # 鞋子圖層 PNG
    └── accessory/                # 配件圖層 PNG（帽子、眼鏡等）
```

---

## 📌 核心資料結構參考

### Outfit 結構

```ts
type Outfit = {
  hair: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory?: string;
};
```

### Inventory 結構（玩家服裝資料）

```ts
type Inventory = {
  owned: {
    hair: string[];
    top: string[];
    bottom: string[];
    shoes: string[];
    accessory?: string[];
  };
  equipped: Outfit;
};
```

---

## 🔧 每個模組用途說明

### components/

- `RPSPanel.tsx`：顯示剪刀石頭布按鈕，並處理玩家出拳與 NPC 對應邏輯
- `DirectionMatch.tsx`：提供黑白配方向選擇，快速反應與勝負判定
- `OutfitPreview.tsx`：根據目前裝備狀態，顯示角色換裝圖層

### screens/

- `GameScreen.tsx`：主要對戰場景，含下注選擇、出拳、黑白配流程
- `ResultScreen.tsx`：顯示勝負結果、獲得/失去的服裝或金幣
- `WardrobeScreen.tsx`：查看與裝備已獲得的服裝，切換並保存裝備狀態

### data/

- `npcs.json`：每個 NPC 的固定服裝、個性描述、可能下注項目等
- `outfits.json`：遊戲內所有可用服裝的定義與分類

### logic/

- `GameEngine.ts`：封裝猜拳、方向比對、賭注處理與勝負結算邏輯
- `OutfitManager.ts`：增刪穿戴物件、切換裝備、同步至 AsyncStorage

### utils/

- `storage.ts`：封裝 AsyncStorage 調用，包括 `loadInventory()`、`saveInventory()` 等

---

## ✅ 建議初步開發順序

1. `GameEngine.ts`：完成猜拳與黑白配邏輯
2. `GameScreen.tsx`：建構主 UI 流程，包含下注、對戰流程
3. `WardrobeScreen.tsx`：建立換裝與服裝展示畫面
4. `OutfitManager.ts`：串接服裝資料儲存與裝備變更
5. 串接 `AdMob` 廣告 SDK（插頁 + 獎勵廣告）
6. 美術素材替換、微調 UI

---
