import { useGetMatchesQuery } from "@/api/matchApi";
import { Match, MatchStatus } from "@/api/types/match";
import { useMatchUpdates } from "@/hooks/data/useMatchUpdate";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import Toogle from "@/shared/Toogle";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { MatchCard } from "../MatchCard";

export const MatchesList = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: initialMatches,
    isLoading,
    error,
    refetch,
  } = useGetMatchesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [matches, setMatches] = useState<Match[]>([]);
  const [updatesEnabled, setUpdatesEnabled] = useState(false);

  useEffect(() => {
    if (initialMatches && !updatesEnabled) {
      setMatches(initialMatches);
      setUpdatesEnabled(true);
    }
  }, [initialMatches, updatesEnabled]);

  const handleManualRetry = useCallback(() => {
    if (error) {
      refetch();
    }
  }, [error, refetch]);

  const handleMatchUpdate = useCallback((updatedMatch: Match) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
    );
  }, []);

  useMatchUpdates(accessToken ?? "", handleMatchUpdate, updatesEnabled);

  const [statusFilter, setStatusFilter] = useState<MatchStatus | "ALL">("ALL");

  const filterOptions: (MatchStatus | "ALL")[] = [
    "ALL",
    MatchStatus.SCHEDULED,
    MatchStatus.LIVE,
    MatchStatus.COMPLETED,
  ];

  const filteredMatches =
    statusFilter === "ALL"
      ? matches
      : matches.filter((m) => m.status === statusFilter);

  if (isLoading && !matches.length) return <ActivityIndicator />;

  if (error && !matches.length) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText>Error loading matches</ThemedText>
        <Button title="Retry Now" onPress={handleManualRetry}></Button>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Toogle
        options={filterOptions.map((s) => s)}
        selected={statusFilter}
        onSelect={(value) => setStatusFilter(value as MatchStatus | "ALL")}
        containerStyle={styles.toggleContainer}
      />

      {error && matches.length > 0 && (
        <View style={styles.partialError}>
          <ThemedText style={styles.partialErrorText}>
            Failed to update matches. Retrying...
          </ThemedText>
        </View>
      )}

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MatchCard match={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <ThemedText>No matches found</ThemedText>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 10,
  },
  toggleContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  retryText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  partialError: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFEAA7",
  },
  partialErrorText: {
    color: "#856404",
    textAlign: "center",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});
