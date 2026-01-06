import {
  useAddToFavoritesMutation,
  useGetFavoritesQuery,
  useGetProductsQuery,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import {
  ProductCard,
  ProductWithFavorite,
} from "@/widgets/products/ProductCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PromoBanner } from "../PromoBanner";

export const HomeScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const limit = 16;
  const [accumulatedProducts, setAccumulatedProducts] = useState<
    ProductWithFavorite[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    error: productsError,
  } = useGetProductsQuery({
    limit,
    offset: page * limit,
    sortBy: "rating",
    sortOrder: "desc",
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

  useEffect(() => {
    if (productsData?.products) {
      const newProductsWithFavorites: ProductWithFavorite[] =
        productsData.products.map((product) => ({
          ...product,
          isFavorite: favoritesSet.has(product.id),
        }));

      if (page === 0) {
        setAccumulatedProducts(newProductsWithFavorites);
      } else {
        setAccumulatedProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNewProducts = newProductsWithFavorites.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prev, ...uniqueNewProducts];
        });
      }
      setIsLoadingMore(false);
    }
  }, [productsData, favoritesSet, page]);

  useEffect(() => {
    setAccumulatedProducts((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((product) => ({
        ...product,
        isFavorite: favoritesSet.has(product.id),
      }));
    });
  }, [favoritesSet]);

  const productsWithFavorites = accumulatedProducts;

  const handleSearchPress = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/products",
        params: {
          search: searchQuery.trim(),
        },
      });
    }
  };

  const handleLoadMore = () => {
    if (
      productsData &&
      accumulatedProducts.length < productsData.total &&
      !isFetchingProducts &&
      !isLoadingProducts &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
      }, 1000);
    }
  };

  const hasMore =
    productsData &&
    accumulatedProducts.length < productsData.total &&
    !isFetchingProducts;

  const showLoader = isLoadingMore || (isFetchingProducts && hasMore);

  return (
    <View style={styles.container}>
      <Header title={t("home.title")} />
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={18}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t("home.searchPlaceholder")}
            placeholderTextColor={Colors.text}
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

      {isLoadingProducts && page === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : productsError ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {t("home.errorLoading")}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={productsWithFavorites}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} onFavoritePress={handleFavoritePress} />
          )}
          contentContainerStyle={styles.content}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.promoContainer}>
                <PromoBanner
                  title="Скидки до 50%"
                  subtitle="На всю коллекцию спортивной одежды"
                  image="https://via.placeholder.com/400x200"
                  onPress={() => console.log("Promo pressed")}
                />
              </View>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>
                  {t("home.popularProducts")}
                </ThemedText>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                {t("home.noProducts")}
              </ThemedText>
            </View>
          }
          ListFooterComponent={
            showLoader ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 90,
    backgroundColor: Colors.background,
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
  content: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  promoContainer: {},
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  row: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  errorText: {
    color: Colors.REJECT,
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
