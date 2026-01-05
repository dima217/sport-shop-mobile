import { Colors } from "@/constants/design-tokens";
import { Header, HEADER_HEIGHT } from "@/shared/layout/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export const ProductDetailsLoading = () => {
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
        style={[styles.loadingContainer, { paddingTop: headerTotalHeight }]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

