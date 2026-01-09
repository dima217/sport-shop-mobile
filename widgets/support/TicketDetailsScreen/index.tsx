import { useGetTicketQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useSupportUpdates } from "@/hooks/data/useSupportUpdates";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import { RootState } from "@/store/store";
import { Ticket } from "@/api/types/support";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return Colors.primary;
    case "in_progress":
      return "#FFA500";
    case "resolved":
      return "#4CAF50";
    case "closed":
      return Colors.textSecondary;
    default:
      return Colors.textSecondary;
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case "open":
      return "Открыт";
    case "in_progress":
      return "В работе";
    case "resolved":
      return "Решен";
    case "closed":
      return "Закрыт";
    default:
      return status;
  }
};

export const TicketDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const ticketId = parseInt(id || "0", 10);

  const {
    data: ticket,
    isLoading,
    error,
    refetch,
  } = useGetTicketQuery(ticketId, {
    skip: !ticketId || isNaN(ticketId),
  });

  const handleTicketUpdate = useCallback(
    (updatedTicket: Ticket) => {
      if (updatedTicket.id === ticketId) {
        refetch();
      }
    },
    [ticketId, refetch]
  );

  useSupportUpdates(accessToken ?? "", handleTicketUpdate, !!accessToken);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title="Обращение"
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

  if (error || !ticket) {
    return (
      <View style={styles.container}>
        <Header
          title="Обращение"
          left={
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color={Colors.text} />
            </TouchableOpacity>
          }
        />
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            Ошибка загрузки обращения
          </ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <ThemedText style={styles.retryButtonText}>Повторить</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusColor = getStatusColor(ticket.status);
  const statusText = getStatusText(ticket.status);
  const createdDate = new Date(ticket.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const updatedDate = new Date(ticket.updatedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.container}>
      <Header
        title={`Обращение #${ticket.id}`}
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
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </ThemedText>
          </View>
        </View>

        {/* Ticket Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Тема</ThemedText>
          <ThemedText style={styles.sectionContent}>{ticket.subject}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ваше сообщение</ThemedText>
          <ThemedText style={styles.sectionContent}>{ticket.message}</ThemedText>
          <ThemedText style={styles.sectionDate}>
            Создано: {createdDate}
          </ThemedText>
        </View>

        {/* Admin Response */}
        {ticket.adminResponse ? (
          <View style={styles.responseSection}>
            <View style={styles.responseHeader}>
              <FontAwesome name="user-shield" size={20} color={Colors.primary} />
              <ThemedText style={styles.responseTitle}>Ответ администратора</ThemedText>
            </View>
            <ThemedText style={styles.responseContent}>
              {ticket.adminResponse}
            </ThemedText>
            <ThemedText style={styles.sectionDate}>
              Обновлено: {updatedDate}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.noResponseSection}>
            <FontAwesome
              name="clock-o"
              size={32}
              color={Colors.textSecondary}
            />
            <ThemedText style={styles.noResponseText}>
              Ожидаем ответа администратора
            </ThemedText>
            <ThemedText style={styles.noResponseSubtext}>
              Мы получили ваше обращение и ответим в ближайшее время
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 20,
  },
  statusContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  sectionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  responseSection: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.primaryLight + "10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  responseContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  noResponseSection: {
    margin: 16,
    padding: 32,
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
  },
  noResponseText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  noResponseSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

