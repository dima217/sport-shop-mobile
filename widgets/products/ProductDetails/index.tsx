import {
  useAddToCartMutation,
  useAddToFavoritesMutation,
  useGetFavoritesQuery,
  useGetProductQuery,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProductDetailsProps {
  productId: string;
}

export const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const { data: favoritesData } = useGetFavoritesQuery({
    limit: 100,
    offset: 0,
  });
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const isFavorite = useMemo(() => {
    return favoritesData?.products.some((p) => p.id === productId) || false;
  }, [favoritesData, productId]);

  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(productId).unwrap();
      } else {
        await addToFavorites(productId).unwrap();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize) {
      return;
    }
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor || null,
      }).unwrap();
      // Можно показать уведомление об успешном добавлении
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const discount = product?.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            Ошибка загрузки товара
          </ThemedText>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backLink}>Вернуться назад</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <FontAwesome
              name={isFavorite ? "heart" : "heart-o"}
              size={24}
              color={isFavorite ? Colors.primary : Colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product.images[selectedImage] || product.images[0] || "",
            }}
            style={styles.mainImage}
          />
          {product.oldPrice && discount > 0 && (
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>-{discount}%</ThemedText>
            </View>
          )}
        </View>

        {product.images.length > 1 && (
          <View style={styles.thumbnailContainer}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(index)}
                style={[
                  styles.thumbnail,
                  selectedImage === index && styles.thumbnailSelected,
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.content}>
          <ThemedText style={styles.category}>
            {product.category?.name || ""}
          </ThemedText>
          <ThemedText style={styles.name}>{product.name}</ThemedText>

          {product.rating && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.rating}>{product.rating}</ThemedText>
              {product.reviewCount !== undefined && (
                <ThemedText style={styles.reviews}>
                  ({product.reviewCount} отзывов)
                </ThemedText>
              )}
            </View>
          )}

          <View style={styles.priceContainer}>
            <ThemedText style={styles.price}>{product.price} ₽</ThemedText>
            {product.oldPrice && (
              <ThemedText style={styles.oldPrice}>
                {product.oldPrice} ₽
              </ThemedText>
            )}
          </View>

          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Размер</ThemedText>
              <View style={styles.sizesContainer}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      selectedSize === size && styles.sizeButtonSelected,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <ThemedText
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextSelected,
                      ]}
                    >
                      {size}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {product.colors && product.colors.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Цвет</ThemedText>
              <View style={styles.sizesContainer}>
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.sizeButton,
                      selectedColor === color && styles.sizeButtonSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <ThemedText
                      style={[
                        styles.sizeText,
                        selectedColor === color && styles.sizeTextSelected,
                      ]}
                    >
                      {color}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Описание</ThemedText>
            <ThemedText style={styles.description}>
              {product.description}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={product.inStock ? "В корзину" : "Нет в наличии"}
          onPress={handleAddToCart}
          disabled={!product.inStock || !selectedSize || isAddingToCart}
          loading={isAddingToCart}
          style={styles.addToCartButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  imageContainer: {
    width: "100%",
    height: 400,
    position: "relative",
    backgroundColor: Colors.backgroundSecondary,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  thumbnailContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  thumbnailSelected: {
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
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
    marginBottom: 16,
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
  priceContainer: {
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  sizesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
    backgroundColor: Colors.background,
  },
  sizeButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "20",
  },
  sizeText: {
    fontSize: 16,
    color: Colors.text,
  },
  sizeTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.INPUT_LINE,
  },
  addToCartButton: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    color: Colors.REJECT,
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  backLink: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
