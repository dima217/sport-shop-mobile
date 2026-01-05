import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View } from "react-native";

interface ProductHeaderProps {
  categoryName?: string;
  productName: string;
  rating?: number | null;
  reviewCount?: number;
}

export const ProductHeader = ({
  categoryName,
  productName,
  rating,
  reviewCount,
}: ProductHeaderProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {categoryName && (
        <ThemedText style={styles.category}>{categoryName}</ThemedText>
      )}
      <ThemedText style={styles.name}>{productName}</ThemedText>

      {rating && (
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color="#FFD700" />
          <ThemedText style={styles.rating}>{rating}</ThemedText>
          {reviewCount !== undefined && (
            <ThemedText style={styles.reviews}>
              ({reviewCount} {t("products.reviews")})
            </ThemedText>
          )}
        </View>
      )}
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  reviews: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
