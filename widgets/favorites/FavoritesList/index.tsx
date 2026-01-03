import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header, HEADER_HEIGHT } from "@/shared/layout/Header";
import {
  ProductCard,
  ProductWithFavorite,
} from "@/widgets/products/ProductCard";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const headerTotalHeight = HEADER_HEIGHT + insets.top;

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
    <View style={styles.container}>
      <Header title="Избранное" />

      {isLoading ? (
        <View
          style={[
            styles.loadingContainer,
            { paddingTop: headerTotalHeight + 16 },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View
          style={[
            styles.emptyContainer,
            { paddingTop: headerTotalHeight + 16 },
          ]}
        >
          <ThemedText style={styles.emptyText}>
            Ошибка загрузки избранного
          </ThemedText>
        </View>
      ) : favorites.length === 0 ? (
        <View
          style={[
            styles.emptyContainer,
            { paddingTop: headerTotalHeight + 16 },
          ]}
        >
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
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: headerTotalHeight + 16 },
          ]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
