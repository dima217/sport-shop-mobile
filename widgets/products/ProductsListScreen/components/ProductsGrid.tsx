import { Colors } from "@/constants/design-tokens";
import {
  ProductCard,
  ProductWithFavorite,
} from "@/widgets/products/ProductCard";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

interface ProductsGridProps {
  products: ProductWithFavorite[];
  onFavoritePress: (productId: string) => void;
  onEndReached?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const ProductsGrid = ({
  products,
  onFavoritePress,
  onEndReached,
  hasMore,
  isLoadingMore,
}: ProductsGridProps) => {
  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard product={item} onFavoritePress={onFavoritePress} />
      )}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingMore && hasMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
