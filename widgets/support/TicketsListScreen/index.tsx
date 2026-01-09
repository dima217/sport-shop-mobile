import { useGetTicketsQuery } from "@/api";
import { Ticket, TicketStatus } from "@/api/types/support";
import { Colors } from "@/constants/design-tokens";
import { useSupportUpdates } from "@/hooks/data/useSupportUpdates";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import { RootState } from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const getStatusColor = (status: TicketStatus) => {
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

const getStatusText = (status: TicketStatus): string => {
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

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

const TicketCard = ({ ticket, onPress }: TicketCardProps) => {
  const statusColor = getStatusColor(ticket.status);
  const statusText = getStatusText(ticket.status);
  const date = new Date(ticket.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hasResponse = !!ticket.adminResponse;

  return (
    <TouchableOpacity style={styles.ticketCard} onPress={onPress}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <ThemedText style={styles.ticketSubject}>{ticket.subject}</ThemedText>
          <ThemedText style={styles.ticketDate}>{date}</ThemedText>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
        >
          <ThemedText style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.ticketMessage} numberOfLines={2}>
        {ticket.message}
      </ThemedText>
      {hasResponse && (
        <View style={styles.responseIndicator}>
          <FontAwesome name="check-circle" size={14} color={Colors.primary} />
          <ThemedText style={styles.responseText}>Есть ответ</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const TicketsListScreen = () => {
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [page, setPage] = useState(0);
  const limit = 20;

  const {
    data: ticketsData,
    isLoading,
    error,
    refetch,
  } = useGetTicketsQuery({
    limit,
    offset: page * limit,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleTicketUpdate = useCallback(
    (updatedTicket: Ticket) => {
      refetch();
    },
    [refetch]
  );

  useSupportUpdates(accessToken ?? "", handleTicketUpdate, !!accessToken);

  const tickets = ticketsData?.tickets || [];

  const filterOptions: (TicketStatus | "all")[] = [
    "all",
    "open",
    "in_progress",
    "resolved",
    "closed",
  ];

  const getFilterText = (filter: TicketStatus | "all"): string => {
    if (filter === "all") return "Все";
    return getStatusText(filter);
  };

  if (isLoading && tickets.length === 0) {
    return (
      <View style={styles.container}>
        <Header
          title="Мои обращения"
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
          title="Мои обращения"
          left={
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color={Colors.text} />
            </TouchableOpacity>
          }
        />
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            Ошибка загрузки обращений
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

  return (
    <View style={styles.container}>
      <Header
        title="Мои обращения"
        left={
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity
            onPress={() => router.push("/profile/support/create")}
          >
            <FontAwesome name="plus" size={24} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={filterOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                statusFilter === item && styles.filterChipActive,
              ]}
              onPress={() => {
                setStatusFilter(item);
                setPage(0);
              }}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  statusFilter === item && styles.filterChipTextActive,
                ]}
              >
                {getFilterText(item)}
              </ThemedText>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        />
      </View>

      {tickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="inbox"
            size={64}
            color={Colors.textSecondary}
            style={styles.emptyIcon}
          />
          <ThemedText style={styles.emptyText}>У вас нет обращений</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Создайте новое обращение, если у вас есть вопросы или проблемы
          </ThemedText>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/profile/support/create")}
          >
            <ThemedText style={styles.createButtonText}>
              Создать обращение
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TicketCard
              ticket={item}
              onPress={() =>
                router.push({
                  pathname: "/profile/support/[id]" as any,
                  params: { id: item.id.toString() },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (ticketsData && tickets.length < ticketsData.total) {
              setPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && tickets.length > 0 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
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
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: 100,
    borderBottomColor: Colors.INPUT_LINE,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.background,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
    marginRight: 12,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ticketMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  responseIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  responseText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
