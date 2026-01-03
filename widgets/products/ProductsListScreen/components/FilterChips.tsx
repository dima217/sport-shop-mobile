import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FilterChipsProps {
  sortBy: "price" | "rating" | "name" | "createdAt" | "reviewCount";
  sortOrder: "asc" | "desc";
  inStock?: boolean;
  onSortByPrice: () => void;
  onSortByRating: () => void;
  onToggleInStock: () => void;
}

export const FilterChips = ({
  sortBy,
  sortOrder,
  inStock,
  onSortByPrice,
  onSortByRating,
  onToggleInStock,
}: FilterChipsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.chip, sortBy === "price" && styles.chipActive]}
          onPress={onSortByPrice}
        >
          <ThemedText
            style={[
              styles.chipText,
              sortBy === "price" && styles.chipTextActive,
            ]}
          >
            По цене {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, sortBy === "rating" && styles.chipActive]}
          onPress={onSortByRating}
        >
          <ThemedText
            style={[
              styles.chipText,
              sortBy === "rating" && styles.chipTextActive,
            ]}
          >
            По рейтингу
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, inStock === true && styles.chipActive]}
          onPress={onToggleInStock}
        >
          <ThemedText
            style={[styles.chipText, inStock === true && styles.chipTextActive]}
          >
            В наличии
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
    paddingBottom: 8,
  },
  content: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight + "20",
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
