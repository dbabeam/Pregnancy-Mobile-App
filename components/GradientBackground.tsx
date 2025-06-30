import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

interface GradientBackgroundProps {
  children: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f9c5d1", "#e5b2f3"]} // Softer pink and violet
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.bubbleTop} />
        <View style={styles.bubbleMiddle} />
      </LinearGradient>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const bubbleSize = width * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bubbleTop: {
    position: "absolute",
    width: bubbleSize,
    height: bubbleSize,
    borderRadius: bubbleSize / 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // softer white
    top: -bubbleSize * 0.3,
    right: -bubbleSize * 0.3,
  },
  bubbleMiddle: {
    position: "absolute",
    width: bubbleSize,
    height: bubbleSize,
    borderRadius: bubbleSize / 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // softer white
    top: bubbleSize * 0.2,
    right: -bubbleSize * 0.5,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default GradientBackground;
