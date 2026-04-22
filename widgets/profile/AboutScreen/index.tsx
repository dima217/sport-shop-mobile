import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "@/shared/layout/Header";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export const AboutScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Header
        title={t("about.title")}
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
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <FontAwesome name="shopping-bag" size={64} color={Colors.primary} />
          </View>
          <ThemedText style={styles.appName}>{t("about.appName")}</ThemedText>
          <ThemedText style={styles.appVersion}>{t("about.version")} 1.0.0</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t("about.description")}</ThemedText>
          <ThemedText style={styles.sectionText}>
            {t("about.descriptionText")}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t("about.contacts")}</ThemedText>
          <View style={styles.contactItem}>
            <FontAwesome name="phone" size={18} color={Colors.primary} />
            <ThemedText style={styles.contactText}>
              +7 (495) 123-45-67
            </ThemedText>
          </View>
          <View style={styles.contactItem}>
            <FontAwesome name="envelope" size={18} color={Colors.primary} />
            <ThemedText style={styles.contactText}>
              support@sportequipment.ru
            </ThemedText>
          </View>
          <View style={styles.contactItem}>
            <FontAwesome name="globe" size={18} color={Colors.primary} />
            <ThemedText style={styles.contactText}>
              www.sportequipment.ru
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t("about.developer")}</ThemedText>
          <ThemedText style={styles.sectionText}>
            {t("about.developerText")}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t("about.license")}</ThemedText>
          <ThemedText style={styles.sectionText}>
            {t("about.licenseText")}
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: Colors.text,
  },
});

