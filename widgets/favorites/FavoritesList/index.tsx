import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import {
  ProductCard,
  ProductWithFavorite,
} from "@/widgets/products/ProductCard";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

export const FavoritesList = () => {
  const { t } = useTranslation();
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
    <View style={styles.container}>
      <Header title={t("favorites.title")} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {t("favorites.errorLoading")}
          </ThemedText>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {t("favorites.empty")}
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            {t("favorites.emptySubtext")}
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
    paddingTop: 90,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
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
