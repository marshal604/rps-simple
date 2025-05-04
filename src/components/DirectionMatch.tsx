import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from "react-native";

interface DirectionMatchProps {
  onDirectionSelected: (direction: "up" | "down" | "left" | "right") => void;
  isFirstPlayer: boolean;
  timeLimit?: number; // in seconds
  disabled?: boolean;
}

const DirectionMatch: React.FC<DirectionMatchProps> = ({
  onDirectionSelected,
  isFirstPlayer,
  timeLimit = 5,
  disabled = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [animation] = useState(new Animated.Value(1));

  // Timer effect
  useEffect(() => {
    if (disabled) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Animation
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    return () => clearInterval(interval);
  }, [disabled]);

  const directions = [
    { id: "up", label: "上", icon: "⬆️" },
    { id: "down", label: "下", icon: "⬇️" },
    { id: "left", label: "左", icon: "⬅️" },
    { id: "right", label: "右", icon: "➡️" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isFirstPlayer ? "喊出方向！" : "選擇相反方向！"}
      </Text>

      <Animated.View
        style={[styles.timerContainer, { transform: [{ scale: animation }] }]}
      >
        <Text style={styles.timer}>{timeLeft}</Text>
      </Animated.View>

      <View style={styles.directionsContainer}>
        {directions.map((direction) => (
          <TouchableOpacity
            key={direction.id}
            style={[styles.directionButton, disabled && styles.disabled]}
            onPress={() =>
              !disabled &&
              onDirectionSelected(
                direction.id as "up" | "down" | "left" | "right"
              )
            }
            disabled={disabled}
          >
            <Text style={styles.directionIcon}>{direction.icon}</Text>
            <Text style={styles.directionLabel}>{direction.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  timerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  directionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  directionButton: {
    padding: 12,
    margin: 8,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  directionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default DirectionMatch;
