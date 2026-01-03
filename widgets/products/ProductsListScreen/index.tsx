import {
  useAddToFavoritesMutation,
  useGetFavoritesQuery,
  useGetProductsQuery,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header, HEADER_HEIGHT } from "@/shared/layout/Header";
import {
  ProductCard,
  ProductWithFavorite,
} from "@/widgets/products/ProductCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ProductsListScreen = () => {
  const params = useLocalSearchParams<{
    categoryId?: string;
    categorySlug?: string;
    search?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerTotalHeight = HEADER_HEIGHT + insets.top;

  const [searchQuery, setSearchQuery] = useState(params.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    brands: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    minRating: undefined as number | undefined,
    inStock: undefined as boolean | undefined,
    sortBy: "createdAt" as
      | "price"
      | "rating"
      | "name"
      | "createdAt"
      | "reviewCount",
    sortOrder: "desc" as "asc" | "desc",
  });

  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery({
    categoryId: params.categoryId,
    categorySlug: params.categorySlug,
    search: searchQuery || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    brands: filters.brands.length > 0 ? filters.brands : undefined,
    sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
    colors: filters.colors.length > 0 ? filters.colors : undefined,
    minRating: filters.minRating,
    inStock: filters.inStock,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    limit: 20,
    offset: 0,
  });

  const { data: favoritesData } = useGetFavoritesQuery({
    limit: 100,
    offset: 0,
  });

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const favoritesSet = useMemo(() => {
    return new Set(favoritesData?.products.map((p) => p.id) || []);
  }, [favoritesData]);

  const handleFavoritePress = async (productId: string) => {
    try {
      if (favoritesSet.has(productId)) {
        await removeFromFavorites(productId).unwrap();
      } else {
        await addToFavorites(productId).unwrap();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const productsWithFavorites: ProductWithFavorite[] = useMemo(() => {
    if (!productsData?.products) return [];
    return productsData.products.map((product) => ({
      ...product,
      isFavorite: favoritesSet.has(product.id),
    }));
  }, [productsData, favoritesSet]);

  const title = params.categorySlug
    ? "Товары"
    : params.search
    ? `Поиск: ${params.search}`
    : "Все товары";

  return (
    <View style={styles.container}>
      <Header
        title={title}
        left={
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <FontAwesome
              name="filter"
              size={20}
              color={showFilters ? Colors.primary : Colors.text}
            />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome
            name="search"
            size={18}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск товаров..."
            placeholderTextColor={Colors.text}
            value={searchQuery}
            onChangeText={setSearchQuery}
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

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersContent}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.sortBy === "price" && styles.filterChipActive,
                ]}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: "price",
                    sortOrder:
                      prev.sortBy === "price" && prev.sortOrder === "asc"
                        ? "desc"
                        : "asc",
                  }))
                }
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    filters.sortBy === "price" && styles.filterChipTextActive,
                  ]}
                >
                  По цене
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.sortBy === "rating" && styles.filterChipActive,
                ]}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: "rating",
                    sortOrder: "desc",
                  }))
                }
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    filters.sortBy === "rating" && styles.filterChipTextActive,
                  ]}
                >
                  По рейтингу
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.inStock === true && styles.filterChipActive,
                ]}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    inStock: prev.inStock === true ? undefined : true,
                  }))
                }
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    filters.inStock === true && styles.filterChipTextActive,
                  ]}
                >
                  В наличии
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {isLoading ? (
        <View
          style={[
            styles.loadingContainer,
            { paddingTop: headerTotalHeight + 100 },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View
          style={[
            styles.errorContainer,
            { paddingTop: headerTotalHeight + 100 },
          ]}
        >
          <ThemedText style={styles.errorText}>
            Ошибка загрузки товаров
          </ThemedText>
        </View>
      ) : productsWithFavorites.length === 0 ? (
        <View
          style={[
            styles.emptyContainer,
            { paddingTop: headerTotalHeight + 100 },
          ]}
        >
          <ThemedText style={styles.emptyText}>Товары не найдены</ThemedText>
        </View>
      ) : (
        <FlatList
          data={productsWithFavorites}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} onFavoritePress={handleFavoritePress} />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: headerTotalHeight + 80 },
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
  searchContainer: {
    position: "absolute",
    top: HEADER_HEIGHT + 60,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
  },
  searchInputContainer: {
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
  filtersContainer: {
    position: "absolute",
    top: HEADER_HEIGHT + 120,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
  },
  filtersContent: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryLight + "20",
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
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
  },
  errorText: {
    color: Colors.REJECT,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
