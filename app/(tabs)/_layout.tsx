import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import AuthChecker from "@/services/auth/AuthChecker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <>
      <AuthChecker />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.inactive,
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: t("tabs.home"),
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: t("tabs.categories"),
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="th-large" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: t("tabs.cart"),
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="shopping-cart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: t("tabs.favorites"),
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="heart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("tabs.profile"),
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
