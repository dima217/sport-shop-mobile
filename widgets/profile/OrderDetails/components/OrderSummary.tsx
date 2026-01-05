import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { StyleSheet, View } from "react-native";

interface OrderSummaryProps {
  total: number;
  createdAt: string;
}

export const OrderSummary = ({ total, createdAt }: OrderSummaryProps) => {
  const { t } = useTranslation();
  const date = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.container}>
      <View style={styles.totalRow}>
        <ThemedText style={styles.totalLabel}>{t("orders.total")}</ThemedText>
        <ThemedText style={styles.totalAmount}>{total} ₽</ThemedText>
      </View>
      <View style={styles.divider} />
      <ThemedText style={styles.dateText}>
        {t("orders.createdAt")}: {date}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.INPUT_LINE,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

