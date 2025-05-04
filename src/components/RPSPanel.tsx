import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";

interface RPSOption {
  id: "rock" | "paper" | "scissors";
  label: string;
  icon: any; // Ideally would be a specific image type
}

interface RPSPanelProps {
  onChoiceSelected: (choice: "rock" | "paper" | "scissors") => void;
  disabled?: boolean;
}

const RPSPanel: React.FC<RPSPanelProps> = ({
  onChoiceSelected,
  disabled = false,
}) => {
  const options: RPSOption[] = [
    {
      id: "rock",
      label: "石頭",
      icon: "👊", // Placeholder, should be replaced with actual image
    },
    {
      id: "paper",
      label: "布",
      icon: "✋", // Placeholder, should be replaced with actual image
    },
    {
      id: "scissors",
      label: "剪刀",
      icon: "✌️", // Placeholder, should be replaced with actual image
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>選擇出拳：</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionButton, disabled && styles.disabled]}
            onPress={() => !disabled && onChoiceSelected(option.id)}
            disabled={disabled}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default RPSPanel;
