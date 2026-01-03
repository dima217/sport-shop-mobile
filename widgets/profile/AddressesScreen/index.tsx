import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Mock данные для адресов
const mockAddresses: Address[] = [
  {
    id: "1",
    street: "ул. Ленина, д. 10, кв. 25",
    city: "Москва",
    postalCode: "123456",
    country: "Россия",
    isDefault: true,
  },
  {
    id: "2",
    street: "пр. Мира, д. 5",
    city: "Санкт-Петербург",
    postalCode: "190000",
    country: "Россия",
  },
];

export const AddressesScreen = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);

  const handleAddAddress = () => {
    // TODO: Navigate to add address screen
    console.log("Add address");
  };

  const handleEditAddress = (address: Address) => {
    // TODO: Navigate to edit address screen
    console.log("Edit address", address);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressInfo}>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <ThemedText style={styles.defaultBadgeText}>
                По умолчанию
              </ThemedText>
            </View>
          )}
          <ThemedText style={styles.addressText}>{item.street}</ThemedText>
          <ThemedText style={styles.addressText}>
            {item.city}, {item.postalCode}
          </ThemedText>
          <ThemedText style={styles.addressText}>{item.country}</ThemedText>
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAddress(item)}
          >
            <FontAwesome name="pencil" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteAddress(item.id)}
          >
            <FontAwesome name="trash" size={18} color={Colors.REJECT} />
          </TouchableOpacity>
        </View>
      </View>
      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(item.id)}
        >
          <ThemedText style={styles.setDefaultText}>
            Установить по умолчанию
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Адреса доставки"
        left={
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />

      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            У вас нет сохраненных адресов
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Добавьте адрес для быстрой доставки
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Добавить адрес"
          onPress={handleAddAddress}
          style={styles.addButton}
        />
      </View>
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
    paddingBottom: 100,
  },
  addressCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  addressInfo: {
    flex: 1,
  },
  defaultBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryLight + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  addressText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  addressActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  setDefaultButton: {
    paddingVertical: 8,
  },
  setDefaultText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.INPUT_LINE,
  },
  addButton: {
    width: "100%",
  },
});
