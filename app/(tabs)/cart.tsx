import { Colors } from "@/constants/design-tokens";
import { CartList } from "@/widgets/cart/CartList";
import { StyleSheet, View } from "react-native";

const Cart = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <CartList />
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
});
