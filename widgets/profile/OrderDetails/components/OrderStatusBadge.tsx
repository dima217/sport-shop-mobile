import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { StyleSheet, View } from "react-native";

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

interface OrderStatusBadgeProps {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const { t } = useTranslation();
  const statusColor = getStatusColor(status);
  const statusText = t(getStatusTranslationKey(status));

  return (
    <View style={[styles.container, { borderColor: statusColor }]}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <ThemedText style={[styles.text, { color: statusColor }]}>
        {statusText}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});

