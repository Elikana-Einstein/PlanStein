import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6C63FF",
        tabBarStyle: {
          backgroundColor: "#0F0F1A",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "TASKS",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="focus"
        options={{
          title: "FOCUS",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="einstein"
        options={{
          title: "E AI",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="me"
        options={{
          title: "ME",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}