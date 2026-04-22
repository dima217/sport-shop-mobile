import { useCreateTicketMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import TextInput from "@/shared/TextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export const CreateTicketScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = t("support.validation.subjectRequired");
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = t("support.validation.subjectMin");
    } else if (formData.subject.trim().length > 255) {
      newErrors.subject = t("support.validation.subjectMax");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("support.validation.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("support.validation.messageMin");
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = t("support.validation.messageMax");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createTicket({
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      }).unwrap();

      Alert.alert(
        t("support.successTitle"),
        t("support.successMessage"),
        [
          {
            text: t("common.ok"),
            onPress: () => {
              router.replace({
                pathname: "/profile/support/[id]",
                params: { id: result.id.toString() },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      Alert.alert(
        t("common.error"),
        error?.data?.message || t("support.errorCreating")
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t("support.createTicket")}
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
            {t("support.describe")}
          </ThemedText>

          <TextInput
            label={t("support.subject")}
            value={formData.subject}
            onChangeText={(text) => {
              setFormData({ ...formData, subject: text });
              if (errors.subject) {
                setErrors({ ...errors, subject: "" });
              }
            }}
            placeholder={t("support.subjectPlaceholder")}
            errorMessage={errors.subject}
            maxLength={250}
          />

          <TextInput
            label={t("support.message")}
            value={formData.message}
            onChangeText={(text) => {
              setFormData({ ...formData, message: text });
              if (errors.message) {
                setErrors({ ...errors, message: "" });
              }
            }}
            placeholder={t("support.messagePlaceholder")}
            errorMessage={errors.message}
            multiline
            numberOfLines={8}
            maxLength={5000}
            style={styles.messageInput}
          />

          <View style={styles.hintContainer}>
            <FontAwesome
              name="info-circle"
              size={16}
              color={Colors.textSecondary}
            />
            <ThemedText style={styles.hintText}>
              {t("support.hint")}
            </ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t("support.submitTicket")}
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
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
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 20,
  },
  messageInput: {
    minHeight: 150,
    textAlignVertical: "top",
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.primaryLight + "10",
    borderRadius: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  submitButton: {
    width: "100%",
  },
});
