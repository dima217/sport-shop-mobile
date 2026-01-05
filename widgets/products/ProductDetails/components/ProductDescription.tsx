import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { StyleSheet, View } from "react-native";

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({
  description,
}: ProductDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{t("products.description")}</ThemedText>
      <ThemedText style={styles.text}>{description}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
});
