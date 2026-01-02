import { ThemedText } from "@/shared/core/ThemedText";
import { StyleSheet, View } from "react-native";
import TeamCard from "../TeamCard";

interface MatchRowProps {
  teamHomeName: string;
  teamAwayName: string;
  scoreHome: string;
  scoreAway: string;
  homeLogo: string;
  awayLogo: string;
}

const MatchRow = ({
  teamHomeName,
  teamAwayName,
  scoreHome,
  scoreAway,
  homeLogo,
  awayLogo,
}: MatchRowProps) => {
  return (
    <View style={styles.teamsScoreContainer}>
      <View style={styles.teamsContainer}>
        <TeamCard teamName={teamHomeName} imageUrl={homeLogo} />
        <TeamCard teamName={teamAwayName} imageUrl={awayLogo} />
      </View>

      <View style={styles.scoreContainer}>
        <ThemedText type="small" style={styles.scoreText}>
          {scoreHome ?? "-"} : {scoreAway ?? "-"}
        </ThemedText>
      </View>
    </View>
  );
};

export default MatchRow;

const styles = StyleSheet.create({
  teamsScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teamsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  scoreContainer: {
    marginLeft: 16,
    minWidth: 60,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
