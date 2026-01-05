import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ReactNode, StyleSheet, View } from "react-native";

interface InfoSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export const InfoSection = ({ title, icon, children }: InfoSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon && (
          <FontAwesome name={icon as any} size={18} color={Colors.primary} />
        )}
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  content: {
    gap: 8,
  },
});

