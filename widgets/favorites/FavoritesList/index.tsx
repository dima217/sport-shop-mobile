import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import {
  ProductCard,
  ProductWithFavorite,
} from "@/widgets/products/ProductCard";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const FavoritesList = () => {
  const {
    data: favoritesData,
    isLoading,
    error,
  } = useGetFavoritesQuery({
    limit: 50,
    offset: 0,
  });
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const handleFavoritePress = async (productId: string) => {
    try {
      await removeFromFavorites(productId).unwrap();
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const favorites: ProductWithFavorite[] =
    favoritesData?.products.map((product) => ({
      ...product,
      isFavorite: true,
    })) || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Избранное</ThemedText>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            Ошибка загрузки избранного
          </ThemedText>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            Нет избранных товаров
          </ThemedText>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
});
