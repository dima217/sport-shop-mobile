import { useClearCartMutation, useCreateOrderMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { addressStorage } from "@/services/addressStorage";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import TextInput from "@/shared/TextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export const CheckoutScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Россия",
    paymentMethod: "card" as "card" | "cash",
    comment: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDefaultAddress();
  }, []);

  const loadDefaultAddress = async () => {
    try {
      const defaultAddress = await addressStorage.getDefaultAddress();
      if (defaultAddress) {
        setFormData((prev) => ({
          ...prev,
          street: defaultAddress.street,
          city: defaultAddress.city,
          postalCode: defaultAddress.postalCode,
          country: defaultAddress.country,
        }));
      }
    } catch (error) {
      console.error("Error loading default address:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.street.trim()) {
      newErrors.street = t("checkout.errors.streetRequired");
    }
    if (!formData.city.trim()) {
      newErrors.city = t("checkout.errors.cityRequired");
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t("checkout.errors.postalCodeRequired");
    }
    if (!formData.country.trim()) {
      newErrors.country = t("checkout.errors.countryRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createOrder({
        deliveryAddress: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim(),
        },
        paymentMethod: formData.paymentMethod,
        comment: formData.comment.trim() || null,
      }).unwrap();

      await clearCart().unwrap();

      Alert.alert(t("checkout.success.title"), t("checkout.success.message"), [
        {
          text: t("common.ok"),
          onPress: () => {
            router.replace("/(tabs)/profile");
            setTimeout(() => {
              router.push("/profile/orders");
            }, 100);
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error creating order:", error);
      Alert.alert(
        t("checkout.error.title"),
        error?.data?.message || t("checkout.error.message")
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t("checkout.title")}
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
            {t("checkout.deliveryAddress")}
          </ThemedText>

          <TextInput
            label={t("addresses.street")}
            value={formData.street}
            onChangeText={(text) => {
              setFormData({ ...formData, street: text });
              if (errors.street) setErrors({ ...errors, street: "" });
            }}
            placeholder={t("checkout.placeholders.street")}
            errorMessage={errors.street}
          />

          <TextInput
            label={t("addresses.city")}
            value={formData.city}
            onChangeText={(text) => {
              setFormData({ ...formData, city: text });
              if (errors.city) setErrors({ ...errors, city: "" });
            }}
            placeholder={t("checkout.placeholders.city")}
            errorMessage={errors.city}
          />

          <TextInput
            label={t("addresses.postalCode")}
            value={formData.postalCode}
            onChangeText={(text) => {
              setFormData({ ...formData, postalCode: text });
              if (errors.postalCode) setErrors({ ...errors, postalCode: "" });
            }}
            placeholder={t("checkout.placeholders.postalCode")}
            errorMessage={errors.postalCode}
          />

          <TextInput
            label={t("addresses.country")}
            value={formData.country}
            onChangeText={(text) => {
              setFormData({ ...formData, country: text });
              if (errors.country) setErrors({ ...errors, country: "" });
            }}
            placeholder={t("checkout.placeholders.country")}
            errorMessage={errors.country}
          />
        </View>

        <View style={styles.sectionPayment}>
          <ThemedText style={styles.sectionTitle}>
            {t("checkout.paymentMethod")}
          </ThemedText>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              formData.paymentMethod === "card" && styles.paymentOptionActive,
            ]}
            onPress={() => setFormData({ ...formData, paymentMethod: "card" })}
          >
            <View style={styles.paymentOptionContent}>
              <FontAwesome
                name="credit-card"
                size={20}
                color={
                  formData.paymentMethod === "card"
                    ? Colors.primary
                    : Colors.textSecondary
                }
              />
              <ThemedText
                style={[
                  styles.paymentOptionText,
                  formData.paymentMethod === "card" &&
                    styles.paymentOptionTextActive,
                ]}
              >
                {t("orders.paymentMethod.card")}
              </ThemedText>
            </View>
            {formData.paymentMethod === "card" && (
              <FontAwesome name="check" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              formData.paymentMethod === "cash" && styles.paymentOptionActive,
            ]}
            onPress={() => setFormData({ ...formData, paymentMethod: "cash" })}
          >
            <View style={styles.paymentOptionContent}>
              <FontAwesome
                name="money"
                size={20}
                color={
                  formData.paymentMethod === "cash"
                    ? Colors.primary
                    : Colors.textSecondary
                }
              />
              <ThemedText
                style={[
                  styles.paymentOptionText,
                  formData.paymentMethod === "cash" &&
                    styles.paymentOptionTextActive,
                ]}
              >
                {t("orders.paymentMethod.cash")}
              </ThemedText>
            </View>
            {formData.paymentMethod === "cash" && (
              <FontAwesome name="check" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {t("checkout.comment")}
          </ThemedText>
          <TextInput
            label={t("checkout.commentLabel")}
            value={formData.comment}
            onChangeText={(text) => setFormData({ ...formData, comment: text })}
            placeholder={t("checkout.placeholders.comment")}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t("checkout.submit")}
            onPress={handleSubmit}
            loading={isCreatingOrder}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
  },
  sectionPayment: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "10",
  },
  paymentOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  paymentOptionTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  submitButton: {
    width: "100%",
  },
});
