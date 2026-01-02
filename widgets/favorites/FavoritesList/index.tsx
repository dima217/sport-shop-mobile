import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Product, ProductCard } from "@/widgets/products/ProductCard";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data
const mockFavorites: Product[] = [
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
    id: "5",
    name: "Спортивная сумка",
    price: 3490,
    image: "https://via.placeholder.com/300",
    category: "Аксессуары",
    rating: 4.3,
    isFavorite: true,
  },
];

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState<Product[]>(mockFavorites);

  const handleFavoritePress = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Избранное</ThemedText>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Нет избранных товаров</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Добавьте товары в избранное, нажав на иконку сердца
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={favorites}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} onFavoritePress={handleFavoritePress} />
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingVertical: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

