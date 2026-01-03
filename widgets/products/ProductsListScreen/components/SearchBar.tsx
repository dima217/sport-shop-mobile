import { Colors } from "@/constants/design-tokens";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Поиск товаров...",
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <FontAwesome
          name="search"
          size={18}
          color={Colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.text}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <FontAwesome
              name="times-circle"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 70,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
});
