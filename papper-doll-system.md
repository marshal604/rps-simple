# 🧍‍♂️ 紙娃娃換裝系統設計說明（完整版）

本文件整理了以 React Native + TypeScript 實作的 2D 紙娃娃換裝系統，包含圖層拆分、對齊原則、優先順序、組件架構與限制評估，並補充擴充性完整支援穿搭配件的方案。

---

## ✅ 目標與核心概念

- 每個角色部位為一張獨立 PNG 圖層（透明背景）
- 所有圖層尺寸統一（如 320x320），使用 `position: absolute` 疊加
- 圖層透過 `zIndex` 控制優先順序
- 所有穿搭資料由 JSON 驅動，支援即時更換與完整換裝

---

## 🧱 圖層拆分建議（含優先順序）

| zIndex | 部位名稱        | 說明                     |
| ------ | --------------- | ------------------------ |
| 1      | face            | 臉型與膚色               |
| 2      | ears            | 耳朵（可選）             |
| 3      | eyebrows        | 眉毛                     |
| 4      | eyes            | 眼睛                     |
| 5      | mouth           | 嘴巴                     |
| 6      | hairBack        | 頭髮後段                 |
| 7      | top             | 上衣主體                 |
| 8      | topAccessory    | 上衣配件（如披風、徽章） |
| 9      | bottom          | 褲子 / 裙子主體          |
| 10     | bottomAccessory | 下身配件（如吊帶、腰鍊） |
| 11     | socks           | 襪子                     |
| 12     | shoes           | 鞋子                     |
| 13     | belt            | 皮帶（可選）             |
| 14     | handAccessory   | 戒指 / 手環              |
| 15     | accessory       | 項鍊、項圈、耳環         |
| 16     | hairFront       | 頭髮前段（瀏海）         |

---

## 📁 建議資料夾結構

```
src/
├── components/
│   └── LayeredCharacter.tsx   # 角色渲染元件
├── data/
│   ├── layers.json            # zIndex 控制圖層順序
│   └── outfit.json            # 當前穿搭設定
├── assets/
│   └── outfits/
│       ├── face/
│       ├── eyes/
│       ├── top/
│       ├── topAccessory/
│       ├── bottom/
│       ├── bottomAccessory/
│       └── ...
```

---

## 🧩 outfit.json 範例（全欄位）

```json
{
  "face": "default_skin",
  "ears": "small_ears",
  "eyebrows": "normal",
  "eyes": "blue_eyes",
  "mouth": "smile",
  "hairBack": "short_black_back",
  "top": "tshirt_white",
  "topAccessory": "vest_red",
  "bottom": "shorts_blue",
  "bottomAccessory": "belt_chain",
  "socks": "socks_white",
  "shoes": "sneakers_red",
  "belt": "belt_brown",
  "handAccessory": "bracelet_gold",
  "accessory": "necklace_silver",
  "hairFront": "short_black_front"
}
```

---

## 🔧 技術關鍵重點

- 所有 PNG 為同尺寸（如 320×320），以 base 為設計對齊點
- 使用 `position: absolute` 疊圖，搭配 `zIndex` 控制層次
- 圖片檔案以 `{部位}/{圖名}.png` 命名對應
- JSON 控制換裝邏輯，可從 UI 傳入穿搭資料
