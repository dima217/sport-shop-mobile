import { useSignUpMutation } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import { secureStore } from "@/services/secureStore";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import Button from "../../../shared/Button";
import EmailInput from "../../../shared/EmailInput";
import PasswordInput from "../../../shared/PasswordInput";
import TextInput from "../../../shared/TextInput";
import { ThemedText } from "../../../shared/core/ThemedText";

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignUpForm = () => {
  const { handleSubmit, control } = useForm<SignUpData>();

  const router = useRouter();
  const { t } = useTranslation();
  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (userData: SignUpData) => {
    setApiError(null);

    try {
      const result = await signUp({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }).unwrap();

      if (result.accessToken) {
        await secureStore.setAccessToken(result.accessToken);
      }

      dispatch(
        setCredentials({
          user: userData,
          accessToken: result.accessToken,
        })
      );

      router.navigate("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = t("auth.unexpectedError");

      const data = error.data as { message?: string } | undefined;

      if (data?.message) {
        errorMessage = data.message;
      } else if (error.status === "FETCH_ERROR") {
        errorMessage = t("auth.networkError");
      }

      setApiError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {apiError && (
        <ThemedText type="error" style={styles.apiErrorText}>
          {apiError}
        </ThemedText>
      )}

      <Controller
        control={control}
        name="email"
        rules={{
          required: t("auth.emailRequired"),
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: t("auth.emailInvalid"),
          },
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <>
            <EmailInput
              value={value}
              onChangeText={onChange}
              placeholder={t("auth.email")}
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: t("auth.passwordRequired"),
          minLength: {
            value: 6,
            message: t("auth.passwordMinLength"),
          },
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <>
            <PasswordInput
              value={value}
              onChangeText={onChange}
              placeholder={t("auth.password")}
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name="firstName"
        rules={{ required: t("auth.firstNameRequired") }}
        render={({ field: { value, onChange }, fieldState }) => (
          <>
            <TextInput
              label={t("auth.firstName")}
              value={value}
              onChangeText={onChange}
              placeholder={t("auth.firstName")}
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name="lastName"
        rules={{ required: t("auth.lastNameRequired") }}
        render={({ field: { value, onChange }, fieldState }) => (
          <>
            <TextInput
              label={t("auth.lastName")}
              value={value}
              onChangeText={onChange}
              placeholder={t("auth.lastName")}
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
      <Button
        title={t("auth.signUp")}
        loading={isLoading}
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 60,
  },
  errorText: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 12,
  },
  apiErrorText: {
    color: "red",
    marginVertical: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SignUpForm;
