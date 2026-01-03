import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { Language } from "@/i18n";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import { setLanguage } from "@/store/slices/languageSlice";
import { RootState } from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const languages: { code: Language; name: string }[] = [
  { code: "ru", name: "Русский" },
  { code: "be", name: "Беларуская" },
  { code: "en", name: "English" },
];

export const SettingsScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();
  const selectedLanguage = useSelector(
    (state: RootState) => state.language.currentLanguage
  );

  const handleLanguageChange = (language: Language) => {
    dispatch(setLanguage(language));
  };

  return (
    <View style={styles.container}>
      <Header
        title={t("settings.title")}
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
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {t("settings.language")}
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            {t("settings.languageDescription")}
          </ThemedText>

          <View style={styles.languagesList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === lang.code && styles.languageItemActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <ThemedText
                  style={[
                    styles.languageText,
                    selectedLanguage === lang.code && styles.languageTextActive,
                  ]}
                >
                  {lang.name}
                </ThemedText>
                {selectedLanguage === lang.code && (
                  <FontAwesome name="check" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  languagesList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  languageItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "10",
  },
  languageText: {
    fontSize: 16,
    color: Colors.text,
  },
  languageTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
