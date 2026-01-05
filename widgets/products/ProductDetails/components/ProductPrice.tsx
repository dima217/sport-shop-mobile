import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { StyleSheet, View } from "react-native";

interface ProductPriceProps {
  price: number;
  oldPrice?: number | null;
}

export const ProductPrice = ({ price, oldPrice }: ProductPriceProps) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.price}>{price} ₽</ThemedText>
      {oldPrice && (
        <ThemedText style={styles.oldPrice}>{oldPrice} ₽</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 20,
    color: Colors.textSecondary,
    textDecorationLine: "line-through",
  },
});

