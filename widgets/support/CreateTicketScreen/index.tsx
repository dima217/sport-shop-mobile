import { useCreateTicketMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
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
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Тема обязательна";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Тема должна содержать минимум 5 символов";
    } else if (formData.subject.trim().length > 255) {
      newErrors.subject = "Тема не должна превышать 255 символов";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Сообщение обязательно";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Сообщение должно содержать минимум 10 символов";
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = "Сообщение не должно превышать 5000 символов";
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
        "Успешно",
        "Ваше обращение создано. Мы ответим вам в ближайшее время.",
        [
          {
            text: "OK",
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
        "Ошибка",
        error?.data?.message ||
          "Не удалось создать обращение. Попробуйте позже."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Создать обращение"
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
            Опишите вашу проблему или вопрос
          </ThemedText>

          <TextInput
            label="Тема обращения"
            value={formData.subject}
            onChangeText={(text) => {
              setFormData({ ...formData, subject: text });
              if (errors.subject) {
                setErrors({ ...errors, subject: "" });
              }
            }}
            placeholder="Проблема с заказом #12345"
            errorMessage={errors.subject}
            maxLength={250}
          />

          <TextInput
            label="Сообщение"
            value={formData.message}
            onChangeText={(text) => {
              setFormData({ ...formData, message: text });
              if (errors.message) {
                setErrors({ ...errors, message: "" });
              }
            }}
            placeholder="Опишите вашу проблему или вопрос подробно..."
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
              Чем подробнее вы опишете проблему, тем быстрее мы сможем вам
              помочь
            </ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Отправить обращение"
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
