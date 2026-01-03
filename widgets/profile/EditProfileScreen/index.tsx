import { useUpdateUserMutation } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { Header } from "@/shared/layout/Header";
import { ThemedText } from "@/shared/core/ThemedText";
import Button from "@/shared/Button";
import TextInput from "@/shared/TextInput";
import { setUser } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const EditProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.auth.user);

  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "");

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      const result = await updateUser({
        id: String(profile.id),
        data: {
          firstName,
          lastName,
          avatarUrl: avatarUrl || null,
        },
      }).unwrap();

      dispatch(
        setUser({
          id: result.id,
          email: profile.email,
          firstName: result.firstName,
          lastName: result.lastName,
          avatarUrl: result.avatarUrl,
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
        title="Редактирование профиля"
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
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <ThemedText style={styles.avatarText}>
                  {firstName[0]?.toUpperCase() ||
                    lastName[0]?.toUpperCase() ||
                    profile?.email?.[0]?.toUpperCase() ||
                    "U"}
                </ThemedText>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={() => {
              // TODO: Implement image picker
              console.log("Change avatar");
            }}
          >
            <ThemedText style={styles.changeAvatarText}>
              Изменить фото
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <TextInput
            label="Имя"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Введите имя"
          />

          <TextInput
            label="Фамилия"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Введите фамилию"
          />

          <TextInput
            label="Email"
            value={profile?.email || ""}
            editable={false}
            placeholder="Email"
          />

          <TextInput
            label="URL аватара (опционально)"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            placeholder="https://example.com/avatar.jpg"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Сохранить"
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
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundSecondary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight + "40",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.primary,
  },
  changeAvatarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeAvatarText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
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

