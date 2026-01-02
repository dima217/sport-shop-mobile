import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

// Mock data - в реальном приложении будет загрузка из API
const mockProduct = {
  id: "1",
  name: "Беговые кроссовки Nike Air Max",
  price: 8990,
  oldPrice: 12990,
  images: [
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400",
  ],
  description:
    "Современные беговые кроссовки с технологией Air Max для максимального комфорта во время тренировок. Легкие и дышащие материалы обеспечивают отличную вентиляцию.",
  category: "Обувь",
  rating: 4.5,
  reviews: 128,
  inStock: true,
  sizes: ["40", "41", "42", "43", "44", "45"],
  colors: ["Черный", "Белый", "Серый"],
};

export const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Показать ошибку
      return;
    }
    // Добавить в корзину
    console.log("Add to cart", productId, selectedSize);
  };

  const discount = mockProduct.oldPrice
    ? Math.round(
        ((mockProduct.oldPrice - mockProduct.price) / mockProduct.oldPrice) *
          100
      )
    : 0;

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
            onPress={() => setIsFavorite(!isFavorite)}
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
            source={{ uri: mockProduct.images[selectedImage] }}
            style={styles.mainImage}
          />
          {mockProduct.oldPrice && discount > 0 && (
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>-{discount}%</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.thumbnailContainer}>
          {mockProduct.images.map((image, index) => (
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

        <View style={styles.content}>
          <ThemedText style={styles.category}>
            {mockProduct.category}
          </ThemedText>
          <ThemedText style={styles.name}>{mockProduct.name}</ThemedText>

          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <ThemedText style={styles.rating}>{mockProduct.rating}</ThemedText>
            <ThemedText style={styles.reviews}>
              ({mockProduct.reviews} отзывов)
            </ThemedText>
          </View>

          <View style={styles.priceContainer}>
            <ThemedText style={styles.price}>{mockProduct.price} ₽</ThemedText>
            {mockProduct.oldPrice && (
              <ThemedText style={styles.oldPrice}>
                {mockProduct.oldPrice} ₽
              </ThemedText>
            )}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Размер</ThemedText>
            <View style={styles.sizesContainer}>
              {mockProduct.sizes.map((size) => (
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

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Описание</ThemedText>
            <ThemedText style={styles.description}>
              {mockProduct.description}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={mockProduct.inStock ? "В корзину" : "Нет в наличии"}
          onPress={handleAddToCart}
          disabled={!mockProduct.inStock || !selectedSize}
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
});
