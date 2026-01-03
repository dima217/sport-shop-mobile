import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Product, ProductCard } from "@/widgets/products/ProductCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PromoBanner } from "../PromoBanner";

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Беговые кроссовки Nike Air Max",
    price: 8990,
    oldPrice: 12990,
    image: "https://via.placeholder.com/300",
    category: "Обувь",
    rating: 4.5,
    isFavorite: false,
  },
  {
    id: "2",
    name: "Спортивный костюм Adidas",
    price: 5990,
    image: "https://via.placeholder.com/300",
    category: "Одежда",
    rating: 4.8,
    isFavorite: true,
  },
  {
    id: "3",
    name: "Гантели 10 кг",
    price: 2490,
    oldPrice: 2990,
    image: "https://via.placeholder.com/300",
    category: "Инвентарь",
    rating: 4.2,
    isFavorite: false,
  },
  {
    id: "4",
    name: "Футбольный мяч",
    price: 1990,
    image: "https://via.placeholder.com/300",
    category: "Инвентарь",
    rating: 4.7,
    isFavorite: false,
  },
  {
    id: "5",
    name: "Спортивная сумка",
    price: 3490,
    image: "https://via.placeholder.com/300",
    category: "Аксессуары",
    rating: 4.3,
    isFavorite: true,
  },
  {
    id: "6",
    name: "Протеиновый коктейль",
    price: 1490,
    oldPrice: 1990,
    image: "https://via.placeholder.com/300",
    category: "Питание",
    rating: 4.6,
    isFavorite: false,
  },
];

export const HomeScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["2", "5"]));

  const handleFavoritePress = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const productsWithFavorites = mockProducts.map((product) => ({
    ...product,
    isFavorite: favorites.has(product.id),
  }));

  const handleSearchPress = () => {
    // Navigate to search screen
    console.log("Search:", searchQuery);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={18}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск товаров..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchPress}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <FontAwesome
                name="times-circle"
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.promoContainer}>
          <PromoBanner
            title="Скидки до 50%"
            subtitle="На всю коллекцию спортивной одежды"
            image="https://via.placeholder.com/400x200"
            onPress={() => console.log("Promo pressed")}
          />
        </View>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Популярные товары</ThemedText>
        </View>
        <View style={styles.productsContainer}>
          <FlatList
            data={productsWithFavorites}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onFavoritePress={handleFavoritePress}
              />
            )}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  promoContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
  productsList: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
});
