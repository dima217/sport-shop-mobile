import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { FlatList, StyleSheet, View } from "react-native";
import { Category, CategoryCard } from "../CategoryCard";

// Mock data
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Одежда",
    image: "https://via.placeholder.com/300",
    productCount: 156,
  },
  {
    id: "2",
    name: "Обувь",
    image: "https://via.placeholder.com/300",
    productCount: 89,
  },
  {
    id: "3",
    name: "Инвентарь",
    image: "https://via.placeholder.com/300",
    productCount: 234,
  },
  {
    id: "4",
    name: "Аксессуары",
    image: "https://via.placeholder.com/300",
    productCount: 67,
  },
  {
    id: "5",
    name: "Питание",
    image: "https://via.placeholder.com/300",
    productCount: 45,
  },
  {
    id: "6",
    name: "Тренажеры",
    image: "https://via.placeholder.com/300",
    productCount: 23,
  },
];

export const CategoriesList = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Категории</ThemedText>
      </View>
      <FlatList
        data={mockCategories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryCard category={item} />}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
});
