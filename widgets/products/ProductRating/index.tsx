import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View } from "react-native";

export function normalizeRating(rating?: number | null): number {
  const value = Number(rating);
  return Number.isFinite(value) ? value : 0;
}

export function normalizeReviewCount(reviewCount?: number | null): number {
  const value = Number(reviewCount);
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

export function formatProductRating(rating?: number | null): string {
  return normalizeRating(rating).toFixed(1);
}

interface ProductRatingProps {
  rating?: number | null;
  reviewCount?: number | null;
  size?: "sm" | "md";
}

export const ProductRating = ({
  rating,
  reviewCount,
  size = "sm",
}: ProductRatingProps) => {
  const { t } = useTranslation();
  const isSmall = size === "sm";
  const displayRating = formatProductRating(rating);
  const displayReviewCount = normalizeReviewCount(reviewCount);

  return (
    <View style={styles.container}>
      <FontAwesome name="star" size={isSmall ? 14 : 16} color="#FFD700" />
      <ThemedText style={[styles.rating, isSmall ? styles.ratingSm : styles.ratingMd]}>
        {displayRating}
      </ThemedText>
      <ThemedText
        style={[styles.reviews, isSmall ? styles.reviewsSm : styles.reviewsMd]}
      >
        ({displayReviewCount} {t("products.reviews")})
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontWeight: "600",
    color: Colors.text,
  },
  ratingSm: {
    fontSize: 12,
  },
  ratingMd: {
    fontSize: 16,
  },
  reviews: {
    color: Colors.textSecondary,
  },
  reviewsSm: {
    fontSize: 12,
  },
  reviewsMd: {
    fontSize: 14,
  },
});
