import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { CartItem } from "@/api/types/cart";
import { StyleSheet, View } from "react-native";

interface OrderItemCardProps {
  item: CartItem;
}

export const OrderItemCard = ({ item }: OrderItemCardProps) => {
  const { t } = useTranslation();
  const totalPrice = item.price * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <ThemedText style={styles.quantity}>×{item.quantity}</ThemedText>
          <View style={styles.productInfo}>
            <ThemedText style={styles.productName}>
              {item.product?.name || t("orders.product")}
            </ThemedText>
            {(item.size || item.color) && (
              <View style={styles.options}>
                {item.size && (
                  <View style={styles.optionBadge}>
                    <ThemedText style={styles.optionText}>
                      {t("products.size")}: {item.size}
                    </ThemedText>
                  </View>
                )}
                {item.color && (
                  <View style={styles.optionBadge}>
                    <ThemedText style={styles.optionText}>
                      {t("products.color")}: {item.color}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>{totalPrice} ₽</ThemedText>
          {item.quantity > 1 && (
            <ThemedText style={styles.unitPrice}>
              {item.price} ₽ × {item.quantity}
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mainInfo: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    minWidth: 30,
  },
  productInfo: {
    flex: 1,
    gap: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
    lineHeight: 20,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  optionBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  priceContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  unitPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

