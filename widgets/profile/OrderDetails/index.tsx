import { useGetOrderQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { InfoRow } from "./components/InfoRow";
import { InfoSection } from "./components/InfoSection";
import { OrderItemCard } from "./components/OrderItemCard";
import { OrderStatusBadge } from "./components/OrderStatusBadge";
import { OrderSummary } from "./components/OrderSummary";

interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: order, isLoading, error } = useGetOrderQuery(orderId);

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

  if (error || !order) {
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
          <FontAwesome
            name="exclamation-circle"
            size={48}
            color={Colors.textSecondary}
          />
          <ThemedText style={styles.errorText}>
            {t("orders.errorLoading")}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`${t("orders.orderNumber")} #${order.id.slice(0, 8)}`}
        left={
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusSection}>
          <ThemedText style={styles.statusLabel}>
            {t("orders.statusLabel")}
          </ThemedText>
          <OrderStatusBadge status={order.status} />
        </View>

        <InfoSection title={t("orders.deliveryAddress")} icon="map-marker">
          <InfoRow
            value={`${order.deliveryStreet}, ${order.deliveryCity}, ${order.deliveryPostalCode}, ${order.deliveryCountry}`}
          />
        </InfoSection>

        <InfoSection title={t("orders.paymentInfo")} icon="credit-card">
          <InfoRow
            value={
              order.paymentMethod === "card"
                ? t("orders.paymentMethod.card")
                : t("orders.paymentMethod.cash")
            }
          />
        </InfoSection>

        {order.comment && (
          <InfoSection title={t("orders.comment")} icon="comment-o">
            <ThemedText style={styles.commentText}>{order.comment}</ThemedText>
          </InfoSection>
        )}

        {order.items && order.items.length > 0 && (
          <View style={styles.itemsSection}>
            <ThemedText style={styles.sectionTitle}>
              {t("orders.items")} ({order.items.length})
            </ThemedText>
            {order.items.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </View>
        )}

        <OrderSummary total={order.total} createdAt={order.createdAt} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  statusSection: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  itemsSection: {
    marginBottom: 8,
  },
  commentText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: "italic",
  },
});
