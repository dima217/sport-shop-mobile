import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { CartItemCard } from "../CartItem";

export const CartList = () => {
  const router = useRouter();
  const { t } = useTranslation();
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
    if (items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <View style={styles.container}>
      <Header title={t("cart.title")} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {t("cart.errorLoading")}
          </ThemedText>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>{t("cart.empty")}</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            {t("cart.emptySubtext")}
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
              <ThemedText style={styles.totalLabel}>
                {t("cart.total")}:
              </ThemedText>
              <ThemedText style={styles.totalPrice}>{total} ₽</ThemedText>
            </View>
            <Button
              title={t("cart.checkout")}
              onPress={handleCheckout}
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 80,
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
