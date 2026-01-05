import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ReactNode, StyleSheet, View } from "react-native";

interface InfoRowProps {
  icon?: string;
  iconColor?: string;
  label?: string;
  value: string | ReactNode;
}

export const InfoRow = ({
  icon,
  iconColor = Colors.textSecondary,
  label,
  value,
}: InfoRowProps) => {
  return (
    <View style={styles.container}>
      {icon && (
        <FontAwesome name={icon as any} size={16} color={iconColor} />
      )}
      <View style={styles.textContainer}>
        {label && <ThemedText style={styles.label}>{label}</ThemedText>}
        {typeof value === "string" ? (
          <ThemedText style={styles.value}>{value}</ThemedText>
        ) : (
          value
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
});

