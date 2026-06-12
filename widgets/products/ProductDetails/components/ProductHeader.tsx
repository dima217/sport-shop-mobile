import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { ProductRating } from "@/widgets/products/ProductRating";
import { StyleSheet, View } from "react-native";

interface ProductHeaderProps {
  categoryName?: string;
  productName: string;
  rating?: number | null;
  reviewCount?: number | null;
}

export const ProductHeader = ({
  categoryName,
  productName,
  rating,
  reviewCount,
}: ProductHeaderProps) => {
  return (
    <View style={styles.container}>
      {categoryName ? (
        <ThemedText style={styles.category}>{categoryName}</ThemedText>
      ) : null}
      <ThemedText style={styles.name}>{productName}</ThemedText>
      <ProductRating rating={rating} reviewCount={reviewCount} size="md" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
});
