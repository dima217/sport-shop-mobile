import { ThemedText } from "@/shared/core/ThemedText";
import { Image, StyleSheet, View } from "react-native";

interface TeamCardProps {
  teamName: string;
  imageUrl: string;
}

const TeamCard = ({ teamName, imageUrl }: TeamCardProps) => {
  return (
    <View style={styles.team}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.teamLogo}
        resizeMode="cover"
      />
      <ThemedText type="small" style={styles.teamText}>
        {teamName}
      </ThemedText>
    </View>
  );
};

export default TeamCard;

const styles = StyleSheet.create({
  team: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  teamText: {
    flexShrink: 1,
    flexWrap: "wrap",
  },
  teamLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFF",
  },
});
