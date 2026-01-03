import { Colors } from "@/constants/design-tokens";
import { ProductDetails } from "@/widgets/products/ProductDetails";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.mainContainer}>
      <ProductDetails productId={id} />
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
