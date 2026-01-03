import type { Category } from "@/api/types/categories";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export type { Category };

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handlePress = () => {
    router.push({
      pathname: "/products" as any,
      params: {
        ...(category.id && { categoryId: category.id }),
        ...(category.slug && { categorySlug: category.slug }),
      },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.image }} style={styles.image} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.infoContainer}>
        <ThemedText style={styles.name}>{category.name}</ThemedText>
        {category.productCount !== undefined && (
          <ThemedText style={styles.count}>
            {category.productCount} {t("categories.productsCount")}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
