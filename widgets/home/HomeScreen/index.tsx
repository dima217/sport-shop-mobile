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
import { PromoBanner } from "../PromoBanner";

export const HomeScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Получаем популярные товары
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useGetProductsQuery({
    limit: 6,
    offset: 0,
    sortBy: "rating",
    sortOrder: "desc",
  });

  // Получаем избранные товары для определения статуса
  const { data: favoritesData } = useGetFavoritesQuery({
    limit: 100,
    offset: 0,
  });

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  // Создаем Set из ID избранных товаров
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
          <ThemedText style={styles.sectionTitle}>
            {t("home.popularProducts")}
          </ThemedText>
        </View>
        {isLoadingProducts ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : productsError ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              {t("home.errorLoading")}
            </ThemedText>
          </View>
        ) : productsWithFavorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {t("home.noProducts")}
            </ThemedText>
          </View>
        ) : (
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
        )}
      </ScrollView>
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
});
