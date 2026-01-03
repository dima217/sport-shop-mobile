import type { Product } from "@/api/types/products";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

// Расширяем Product для UI нужд
export interface ProductWithFavorite extends Omit<Product, "category"> {
  isFavorite?: boolean;
  // Для обратной совместимости с компонентами
  image?: string; // Первое изображение из массива images
  category?: string | Product["category"]; // Название категории или объект
}

interface ProductCardProps {
  product: ProductWithFavorite;
  onFavoritePress?: (productId: string) => void;
}

export const ProductCard = ({ product, onFavoritePress }: ProductCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    onFavoritePress?.(product.id);
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Используем первое изображение из массива или image для обратной совместимости
  const imageUrl = product.images?.[0] || product.image || "";
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        {product.oldPrice && discount > 0 && (
          <View style={styles.discountBadge}>
            <ThemedText style={styles.discountText}>-{discount}%</ThemedText>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <FontAwesome
            name={product.isFavorite ? "heart" : "heart-o"}
            size={20}
            color={product.isFavorite ? Colors.primary : Colors.textSecondary}
          />
        </TouchableOpacity>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <View style={styles.infoContainer}>
        <ThemedText style={styles.category}>{categoryName}</ThemedText>
        <ThemedText style={styles.name} numberOfLines={2}>
          {product.name}
        </ThemedText>
        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>{product.price} ₽</ThemedText>
          {product.oldPrice && (
            <ThemedText style={styles.oldPrice}>
              {product.oldPrice} ₽
            </ThemedText>
          )}
        </View>
        {product.rating && (
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <ThemedText style={styles.rating}>{product.rating}</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Экспортируем для обратной совместимости
export type { Product } from "@/api/types/products";

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
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    backgroundColor: Colors.backgroundSecondary,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  infoContainer: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    minHeight: 36,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
