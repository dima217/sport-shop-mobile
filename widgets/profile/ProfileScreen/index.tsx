import {
  useGetOrdersQuery,
  useSignOutMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { Header, HEADER_HEIGHT } from "@/shared/layout/Header";
import { ThemedText } from "@/shared/core/ThemedText";
import { clearAuth } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

interface ProfileOption {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeCount?: number;
}

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerTotalHeight = HEADER_HEIGHT + insets.top;

  const profile = useSelector((state: RootState) => state.auth.user);
  const [signOut] = useSignOutMutation();
  const { data: orders, isLoading: isLoadingOrders } = useGetOrdersQuery();

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      dispatch(clearAuth());
    } catch (error) {
      console.error("Error signing out:", error);
      // В любом случае очищаем локальное состояние
      dispatch(clearAuth());
    }
  };

  const options: ProfileOption[] = [
    {
      id: "orders",
      title: "Мои заказы",
      icon: "shopping-bag",
      onPress: () => {
        // TODO: Navigate to orders screen
        console.log("Navigate to orders");
      },
      showBadge: orders && orders.length > 0,
      badgeCount: orders?.length,
    },
    {
      id: "favorites",
      title: "Избранное",
      icon: "heart",
      onPress: () => {
        router.push("/(tabs)/favorites");
      },
    },
    {
      id: "addresses",
      title: "Адреса доставки",
      icon: "map-marker",
      onPress: () => {
        // TODO: Navigate to addresses screen
        console.log("Navigate to addresses");
      },
    },
    {
      id: "settings",
      title: "Настройки",
      icon: "cog",
      onPress: () => {
        // TODO: Navigate to settings screen
        console.log("Navigate to settings");
      },
    },
    {
      id: "help",
      title: "Помощь и поддержка",
      icon: "question-circle",
      onPress: () => {
        // TODO: Navigate to help screen
        console.log("Navigate to help");
      },
    },
    {
      id: "about",
      title: "О приложении",
      icon: "info-circle",
      onPress: () => {
        // TODO: Navigate to about screen
        console.log("Navigate to about");
      },
    },
  ];

  const renderOption = ({ item }: { item: ProfileOption }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <FontAwesome name={item.icon as any} size={20} color={Colors.primary} />
        </View>
        <ThemedText style={styles.optionTitle}>{item.title}</ThemedText>
      </View>
      <View style={styles.optionRight}>
        {item.showBadge && item.badgeCount !== undefined && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{item.badgeCount}</ThemedText>
          </View>
        )}
        <FontAwesome
          name="chevron-right"
          size={16}
          color={Colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Профиль" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: headerTotalHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <ThemedText style={styles.avatarText}>
                  {profile?.firstName?.[0]?.toUpperCase() ||
                    profile?.email?.[0]?.toUpperCase() ||
                    "U"}
                </ThemedText>
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>
              {profile?.firstName && profile?.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : profile?.email || "Пользователь"}
            </ThemedText>
            {profile?.email && (
              <ThemedText style={styles.profileEmail}>{profile.email}</ThemedText>
            )}
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              // TODO: Navigate to edit profile
              console.log("Edit profile");
            }}
          >
            <FontAwesome name="pencil" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          <FlatList
            data={options}
            renderItem={renderOption}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <FontAwesome name="sign-out" size={18} color={Colors.REJECT} />
            <ThemedText style={styles.signOutText}>Выйти</ThemedText>
          </TouchableOpacity>
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.background,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSecondary,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight + "40",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  editButton: {
    padding: 8,
  },
  optionsContainer: {
    backgroundColor: Colors.background,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.INPUT_LINE,
    marginLeft: 52,
  },
  signOutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    color: Colors.REJECT,
    fontWeight: "600",
  },
});

