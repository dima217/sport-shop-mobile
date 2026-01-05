import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header, HEADER_HEIGHT } from "@/shared/layout/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export const ProductDetailsError = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerTotalHeight = HEADER_HEIGHT + insets.top;

  return (
    <View style={styles.container}>
      <Header
        title=""
        left={
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />
      <View
        style={[
          styles.errorContainer,
          { paddingTop: headerTotalHeight + 16 },
        ]}
      >
        <ThemedText style={styles.errorText}>
          Ошибка загрузки товара
        </ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.backLink}>Вернуться назад</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    color: Colors.REJECT,
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  backLink: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

