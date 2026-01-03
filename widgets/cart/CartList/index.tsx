import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartItemCard } from "../CartItem";

export const CartList = () => {
  const { data: cartData, isLoading, error } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const handleRemove = async (id: string) => {
    try {
      await removeCartItem(id).unwrap();
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    try {
      await updateCartItem({ id, data: { quantity } }).unwrap();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const items = cartData?.items || [];
  const total = cartData?.total || 0;

  const handleCheckout = () => {
    console.log("Checkout", total);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Корзина</ThemedText>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            Ошибка загрузки корзины
          </ThemedText>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Корзина пуста</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Добавьте товары из каталога
          </ThemedText>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItemCard
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <ThemedText style={styles.totalLabel}>Итого:</ThemedText>
              <ThemedText style={styles.totalPrice}>{total} ₽</ThemedText>
            </View>
            <Button
              title="Оформить заказ"
              onPress={handleCheckout}
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.INPUT_LINE,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  checkoutButton: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
});
