import { useGetOrdersQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return Colors.textSecondary;
    case "processing":
      return Colors.primary;
    case "shipped":
      return Colors.primaryDark;
    case "delivered":
      return "#4CAF50";
    case "cancelled":
      return Colors.REJECT;
    default:
      return Colors.textSecondary;
  }
};

interface OrderCardProps {
  order: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    deliveryCity: string;
    deliveryStreet: string;
    paymentMethod: string;
  };
  onPress: () => void;
}

const getStatusTranslationKey = (
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
):
  | "orders.status.pending"
  | "orders.status.processing"
  | "orders.status.shipped"
  | "orders.status.delivered"
  | "orders.status.cancelled" => {
  return `orders.status.${status}` as any;
};

const OrderCard = ({ order, onPress }: OrderCardProps) => {
  const { t } = useTranslation();
  const statusColor = getStatusColor(order.status);
  const statusText = t(
    getStatusTranslationKey(
      order.status as
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
    )
  );
  const date = new Date(order.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <ThemedText style={styles.orderId}>
            {t("orders.orderNumber")} #{order.id.slice(0, 8)}
          </ThemedText>
          <ThemedText style={styles.orderDate}>{date}</ThemedText>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
        >
          <ThemedText style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <FontAwesome
            name="map-marker"
            size={14}
            color={Colors.textSecondary}
          />
          <ThemedText style={styles.detailText}>
            {order.deliveryCity}, {order.deliveryStreet}
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome
            name="credit-card"
            size={14}
            color={Colors.textSecondary}
          />
          <ThemedText style={styles.detailText}>
            {order.paymentMethod === "card"
              ? t("orders.paymentMethod.card")
              : t("orders.paymentMethod.cash")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <ThemedText style={styles.orderTotal}>{order.total} ₽</ThemedText>
        <FontAwesome
          name="chevron-right"
          size={16}
          color={Colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

export const OrdersScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const handleOrderPress = (orderId: string) => {
    router.push({
      pathname: "/profile/orders/[id]" as any,
      params: { id: orderId },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title={t("orders.title")}
          left={
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color={Colors.text} />
            </TouchableOpacity>
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header
          title={t("orders.title")}
          left={
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color={Colors.text} />
            </TouchableOpacity>
          }
        />
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {t("profile.errorLoadingOrders")}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={t("orders.title")}
        left={
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />

      {!orders || orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="shopping-bag"
            size={64}
            color={Colors.textSecondary}
          />
          <ThemedText style={styles.emptyText}>
            {t("profile.noOrders")}
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            {t("profile.noOrdersSubtext")}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => handleOrderPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: 100,
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.INPUT_LINE,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
