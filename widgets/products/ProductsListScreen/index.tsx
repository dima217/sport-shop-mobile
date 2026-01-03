import {
  useAddToFavoritesMutation,
  useGetFavoritesQuery,
  useGetProductsQuery,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import { ProductWithFavorite } from "@/widgets/products/ProductCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FilterChips } from "./components/FilterChips";
import { ProductsGrid } from "./components/ProductsGrid";
import { SearchBar } from "./components/SearchBar";

export const ProductsListScreen = () => {
  const params = useLocalSearchParams<{
    categoryId?: string;
    categorySlug?: string;
    search?: string;
  }>();
  const router = useRouter();

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

  const handleSortByPrice = () => {
    setFilters((prev) => ({
      ...prev,
      sortBy: "price",
      sortOrder:
        prev.sortBy === "price" && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleSortByRating = () => {
    setFilters((prev) => ({
      ...prev,
      sortBy: "rating",
      sortOrder: "desc",
    }));
  };

  const handleToggleInStock = () => {
    setFilters((prev) => ({
      ...prev,
      inStock: prev.inStock === true ? undefined : true,
    }));
  };

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

      <View style={styles.contentWrapper}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {showFilters && (
          <FilterChips
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            inStock={filters.inStock}
            onSortByPrice={handleSortByPrice}
            onSortByRating={handleSortByRating}
            onToggleInStock={handleToggleInStock}
          />
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              Ошибка загрузки товаров
            </ThemedText>
          </View>
        ) : productsWithFavorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Товары не найдены</ThemedText>
          </View>
        ) : (
          <ProductsGrid
            products={productsWithFavorites}
            onFavoritePress={handleFavoritePress}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorText: {
    color: Colors.REJECT,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
