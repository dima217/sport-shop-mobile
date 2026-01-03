import { useGetCategoriesQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { CategoryCard } from "../CategoryCard";

export const CategoriesList = () => {
  const { t } = useTranslation();
  const {
    data: categories,
    isLoading,
    error,
  } = useGetCategoriesQuery({
    limit: 50,
    offset: 0,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title={t("categories.title")} />
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title={t("categories.title")} />
        <View style={[styles.errorContainer]}>
          <ThemedText style={styles.errorText}>
            {t("categories.errorLoading")}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t("categories.title")} />
      {categories && categories.length > 0 ? (
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CategoryCard category={item} />}
          contentContainerStyle={[styles.listContent]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {t("categories.noCategories")}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 90,
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
