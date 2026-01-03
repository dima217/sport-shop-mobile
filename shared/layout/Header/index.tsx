import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export const Header = ({ title, right, left }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {left && <View style={styles.leftContainer}>{left}</View>}
        {title ? (
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>{title}</ThemedText>
          </View>
        ) : (
          <View style={styles.titleContainer} />
        )}
        {right && <View style={styles.rightContainer}>{right}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.background,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  leftContainer: {
    minWidth: 40,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  rightContainer: {
    minWidth: 40,
    alignItems: "flex-end",
  },
});

// Константа для высоты Header (без учета safe area)
// paddingVertical: 16 * 2 = 32 + примерная высота текста 24 = 56
export const HEADER_HEIGHT = 56;
