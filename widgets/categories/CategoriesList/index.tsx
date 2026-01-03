import { useGetCategoriesQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header, HEADER_HEIGHT } from "@/shared/layout/Header";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryCard } from "../CategoryCard";

export const CategoriesList = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useGetCategoriesQuery({
    limit: 50,
    offset: 0,
  });
  const insets = useSafeAreaInsets();
  const headerTotalHeight = HEADER_HEIGHT + insets.top;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Категории" />
        <View
          style={[
            styles.loadingContainer,
            { paddingTop: headerTotalHeight + 16 },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Категории" />
        <View
          style={[
            styles.errorContainer,
            { paddingTop: headerTotalHeight + 16 },
          ]}
        >
          <ThemedText style={styles.errorText}>
            Ошибка загрузки категорий
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Категории" />
      {categories && categories.length > 0 ? (
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CategoryCard category={item} />}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: headerTotalHeight + 16 },
          ]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Категории не найдены</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorText: {
    color: Colors.REJECT,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
