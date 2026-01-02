import { Colors } from "@/constants/design-tokens";
import { FavoritesList } from "@/widgets/favorites/FavoritesList";
import { StyleSheet, View } from "react-native";

const Favorites = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <FavoritesList />
      </View>
    </View>
  );
};

export default Favorites;

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
