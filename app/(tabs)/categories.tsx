import { Colors } from "@/constants/design-tokens";
import { CategoriesList } from "@/widgets/categories/CategoriesList";
import { StyleSheet, View } from "react-native";

const Categories = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <CategoriesList />
      </View>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
});
