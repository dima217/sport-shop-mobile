import { Colors } from "@/constants/design-tokens";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import { ProductDetails } from "@/widgets/products/ProductDetails";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.mainContainer}>
      <KeyboardAwareView style={styles.keyboardAwareView}>
        <ProductDetails productId={id} />
      </KeyboardAwareView>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  keyboardAwareView: {
    flex: 1,
  },
});
