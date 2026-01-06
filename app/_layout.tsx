import { Colors } from "@/constants/design-tokens";
import { NetworkProvider, useNetwork } from "@/providers/NetworkProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { persistor, store } from "@/store/store";
import { NoInternetScreen } from "@/widgets/internet/NoInternetScreen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function LayoutContent() {
  const { networkError } = useNetwork();

  if (networkError) {
    return <NoInternetScreen />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors.background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="product" options={{ headerShown: false }} />
      <Stack.Screen name="products" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <NetworkProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <WebSocketProvider>
            <LayoutContent />
            <StatusBar style="auto" />
          </WebSocketProvider>
        </PersistGate>
      </Provider>
    </NetworkProvider>
  );
}
