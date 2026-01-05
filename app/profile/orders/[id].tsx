import { Colors } from "@/constants/design-tokens";
import { OrderDetails } from "@/widgets/profile/OrderDetails";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.mainContainer}>
      <OrderDetails orderId={id} />
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});

