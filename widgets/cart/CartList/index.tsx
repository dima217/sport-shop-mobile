import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartItemCard, CartItem } from "../CartItem";

// Mock data
const mockCartItems: CartItem[] = [
  {
    id: "1",
    productId: "1",
    name: "Беговые кроссовки Nike Air Max",
    price: 8990,
    image: "https://via.placeholder.com/300",
    size: "42",
    quantity: 1,
  },
  {
    id: "2",
    productId: "2",
    name: "Спортивный костюм Adidas",
    price: 5990,
    image: "https://via.placeholder.com/300",
    size: "M",
    quantity: 2,
  },
];

export const CartList = () => {
  const [items, setItems] = useState<CartItem[]>(mockCartItems);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    console.log("Checkout", total);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Корзина</ThemedText>
      </View>

      {items.length === 0 ? (
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
});

