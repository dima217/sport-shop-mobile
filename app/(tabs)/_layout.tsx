import { Colors } from "@/constants/design-tokens";
import AuthChecker from "@/services/auth/AuthChecker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
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
            title: "Главная",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Категории",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="th-large" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Корзина",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="shopping-cart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Избранное",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="heart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Профиль",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
