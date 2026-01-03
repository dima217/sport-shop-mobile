import IconSvg from "@/assets/images/icon.svg";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import SignUpForm from "@/widgets/register/SignUpForm";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

const SignUp = () => {
  const router = useRouter();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.backgroundIconContainer}>
        <IconSvg style={styles.backgroundIcon} />
      </View>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <ThemedText type="title">Sign Up</ThemedText>
        </View>
        <SignUpForm />
      </View>
      <View style={styles.innerContainer}>
        <AuthPrompt
          promptText="Already have an account?"
          actionText="Login"
          onPressAction={() => router.navigate("/(auth)/login")}
        />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  backgroundIconContainer: {
    position: "absolute",
    top: 120,
    right: -40,
    zIndex: 0,
    opacity: 0.2,
  },
  backgroundIcon: {},
  container: {
    flex: 1,
    gap: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: "15%",
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  icon: {
    width: 68,
    height: 68,
    resizeMode: "contain",
  },
});
