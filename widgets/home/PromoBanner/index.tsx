import { ThemedText } from "@/shared/core/ThemedText";
import RadialGradientBackground from "@/shared/ui/RadialGradientBackground";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface PromoBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  onPress?: () => void;
}

export const PromoBanner = ({
  title,
  subtitle,
  image,
  onPress,
}: PromoBannerProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <RadialGradientBackground style={styles.radialContainer} />

      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  radialContainer: {
    borderRadius: 20,
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
});
