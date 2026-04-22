import { useSignInMutation } from "@/api";
import { secureStore } from "@/services/secureStore";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import { useTranslation } from "@/hooks/useTranslation";
import Button from "../../../shared/Button";
import EmailInput from "../../../shared/EmailInput";
import PasswordInput from "../../../shared/PasswordInput";
import { ThemedText } from "../../../shared/core/ThemedText";

interface LoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { handleSubmit, control } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { t } = useTranslation();
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (userData: LoginData) => {
    setApiError(null);

    try {
      const result = await signIn({
        email: userData.email,
        password: userData.password,
      }).unwrap();

      if (result.accessToken) {
        await secureStore.setAccessToken(result.accessToken);
      }

      dispatch(
        setCredentials({
          user: {
            id: result.user.profile.id,
            email: userData.email,
            firstName: result.user.profile.firstName,
            lastName: result.user.profile.lastName,
          },
          accessToken: result.accessToken,
        })
      );

      router.replace("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = t("auth.loginFailed");

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      setApiError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
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
          <EmailInput
            value={value}
            onChangeText={onChange}
            errorMessage={fieldState.error?.message}
          />
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
          <PasswordInput
            value={value}
            onChangeText={onChange}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {apiError && (
        <ThemedText type="error" style={styles.apiErrorText}>
          {apiError}
        </ThemedText>
      )}

      <Button
        title={t("auth.signIn")}
        loading={isLoading}
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 80,
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

export default LoginForm;
