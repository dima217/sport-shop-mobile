import {
  ProductCard,
  ProductWithFavorite,
} from "@/widgets/products/ProductCard";
import { FlatList, StyleSheet } from "react-native";

interface ProductsGridProps {
  products: ProductWithFavorite[];
  onFavoritePress: (productId: string) => void;
}

export const ProductsGrid = ({
  products,
  onFavoritePress,
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
});
