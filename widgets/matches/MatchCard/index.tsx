import { Match } from "@/api/types/match";
import { ThemedText } from "@/shared/core/ThemedText";
import GradientView from "@/shared/Gradient";
import { StyleSheet, View } from "react-native";
import MatchRow from "./components/MatchRow";

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const statusColor =
    match.status.toLowerCase() === "live"
      ? "#FF4C4C"
      : match.status.toLowerCase() === "finished"
      ? "#4CAF50"
      : "#FFD700";

  return (
    <GradientView style={styles.card}>
      <ThemedText type="subtitle" style={styles.title}>
        {match.title}
      </ThemedText>

      <MatchRow
        teamHomeName={match.teamHome.name}
        teamAwayName={match.teamAway.name}
        scoreHome={match.scoreHome ?? "-"}
        scoreAway={match.scoreAway ?? "-"}
        homeLogo={match.teamHome.logoUrl ?? ""}
        awayLogo={match.teamAway.logoUrl ?? ""}
      />

      <View style={styles.infoContainer}>
        <ThemedText
          type="link"
          style={[styles.resultText, { color: statusColor }]}
        >
          {match.status.toUpperCase()}
        </ThemedText>
        <ThemedText type="link" style={styles.infoText}>
          {match.info || "No additional info"}
        </ThemedText>
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#AAA",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#AAA",
    flexShrink: 1,
    flexWrap: "wrap",
  },
});
