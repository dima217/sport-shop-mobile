import { Colors } from "@/constants/design-tokens";
import { HomeScreen } from "@/widgets/home/HomeScreen";
import { StyleSheet, View } from "react-native";

const Home = () => {
  return (
    <View style={styles.mainContainer}>
      <HomeScreen />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
