import { useUpdateProfileMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Button";
import { Header } from "@/shared/layout/Header";
import TextInput from "@/shared/TextInput";
import { setUser } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const EditProfileScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.auth.user);

  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      const result = await updateProfile({
        firstName,
        lastName,
      }).unwrap();

      // Parse name from "firstName lastName" format
      //const nameParts = result.name.split(" ");
      //const updatedFirstName = nameParts[0] || firstName;
      //const updatedLastName = nameParts.slice(1).join(" ") || lastName;

      dispatch(
        setUser({
          id: result.id,
          email: result.email || profile.email,
          firstName: firstName,
          lastName: lastName,
        })
      );

      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t("profile.editProfile")}
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
        <View style={styles.formSection}>
          <TextInput
            label={t("profile.firstName")}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t("profile.firstNamePlaceholder")}
          />

          <TextInput
            label={t("profile.lastName")}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t("profile.lastNamePlaceholder")}
          />

          <TextInput
            label={t("profile.email")}
            value={profile?.email || ""}
            editable={false}
            placeholder={t("profile.email")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t("common.save")}
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 20,
  },
  formSection: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  saveButton: {
    width: "100%",
  },
});
