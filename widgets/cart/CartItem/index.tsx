import type { CartItem as CartItemType } from "@/api/types/cart";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

// Расширяем CartItem для UI нужд (обратная совместимость с mock данными)
export interface CartItem extends CartItemType {
  name?: string;
  image?: string;
}

interface CartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export const CartItemCard = ({
  item,
  onRemove,
  onQuantityChange,
}: CartItemProps) => {
  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            item.image ||
            item.product?.images?.[0] ||
            "https://via.placeholder.com/300",
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {item.name || item.product?.name || "Товар"}
        </ThemedText>
        {item.size && (
          <ThemedText style={styles.size}>Размер: {item.size}</ThemedText>
        )}
        <ThemedText style={styles.price}>{item.price} ₽</ThemedText>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleDecrease}
        >
          <FontAwesome name="minus" size={14} color={Colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleIncrease}
        >
          <FontAwesome name="plus" size={14} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <FontAwesome name="trash" size={18} color={Colors.REJECT} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  size: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
});
