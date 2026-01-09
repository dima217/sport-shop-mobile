import { Colors } from "@/constants/design-tokens";
import { Address, addressStorage } from "@/services/addressStorage";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { Header } from "@/shared/layout/Header";
import TextInput from "@/shared/TextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export const AddressesScreen = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Россия",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const loadedAddresses = await addressStorage.getAddresses();
      setAddresses(loadedAddresses);
    } catch (error) {
      console.error("Error loading addresses:", error);
      Alert.alert("Ошибка", "Не удалось загрузить адреса");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      street: "",
      city: "",
      postalCode: "",
      country: "Россия",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.street.trim()) {
      errors.street = "Улица обязательна";
    }
    if (!formData.city.trim()) {
      errors.city = "Город обязателен";
    }
    if (!formData.postalCode.trim()) {
      errors.postalCode = "Почтовый индекс обязателен";
    }
    if (!formData.country.trim()) {
      errors.country = "Страна обязательна";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      if (editingAddress) {
        await addressStorage.updateAddress(editingAddress.id, formData);
      } else {
        await addressStorage.addAddress(formData);
      }
      await loadAddresses();
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
      Alert.alert("Ошибка", "Не удалось сохранить адрес");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    Alert.alert("Удалить адрес", "Вы уверены, что хотите удалить этот адрес?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            await addressStorage.deleteAddress(id);
            await loadAddresses();
          } catch (error) {
            console.error("Error deleting address:", error);
            Alert.alert("Ошибка", "Не удалось удалить адрес");
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressStorage.setDefaultAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      Alert.alert("Ошибка", "Не удалось установить адрес по умолчанию");
    }
  };

  const handleRemoveDefault = async (id: string) => {
    try {
      await addressStorage.removeDefaultAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error("Error removing default address:", error);
      Alert.alert("Ошибка", "Не удалось отменить адрес по умолчанию");
    }
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
      <TouchableOpacity
        style={styles.setDefaultButton}
        onPress={() =>
          item.isDefault
            ? handleRemoveDefault(item.id)
            : handleSetDefault(item.id)
        }
      >
        <ThemedText style={styles.setDefaultText}>
          {item.isDefault ? "Отменить по умолчанию" : "Установить по умолчанию"}
        </ThemedText>
      </TouchableOpacity>
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

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Загрузка...</ThemedText>
        </View>
      ) : addresses.length === 0 ? (
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

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalContainer}>
          <Header
            title={editingAddress ? "Редактировать адрес" : "Добавить адрес"}
            left={
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <FontAwesome name="arrow-left" size={24} color={Colors.text} />
              </TouchableOpacity>
            }
          />

          <View style={styles.formContainer}>
            <TextInput
              label="Улица"
              value={formData.street}
              onChangeText={(text) => {
                setFormData({ ...formData, street: text });
                if (formErrors.street) {
                  setFormErrors({ ...formErrors, street: "" });
                }
              }}
              placeholder="ул. Ленина, д. 10, кв. 25"
              errorMessage={formErrors.street}
            />

            <TextInput
              label="Город"
              value={formData.city}
              onChangeText={(text) => {
                setFormData({ ...formData, city: text });
                if (formErrors.city) {
                  setFormErrors({ ...formErrors, city: "" });
                }
              }}
              placeholder="Москва"
              errorMessage={formErrors.city}
            />

            <TextInput
              label="Почтовый индекс"
              value={formData.postalCode}
              onChangeText={(text) => {
                setFormData({ ...formData, postalCode: text });
                if (formErrors.postalCode) {
                  setFormErrors({ ...formErrors, postalCode: "" });
                }
              }}
              placeholder="123456"
              errorMessage={formErrors.postalCode}
            />

            <TextInput
              label="Страна"
              value={formData.country}
              onChangeText={(text) => {
                setFormData({ ...formData, country: text });
                if (formErrors.country) {
                  setFormErrors({ ...formErrors, country: "" });
                }
              }}
              placeholder="Россия"
              errorMessage={formErrors.country}
            />

            <View style={styles.formButtons}>
              <Button
                title={editingAddress ? "Сохранить" : "Добавить"}
                onPress={handleSaveAddress}
                style={styles.saveButton}
              />
              <Button
                title="Отмена"
                onPress={() => setShowForm(false)}
                buttonColor={Colors.backgroundSecondary}
                textColor={Colors.text}
                style={styles.cancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 90,
    paddingBottom: 20,
    gap: 16,
  },
  formButtons: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    width: "100%",
  },
  cancelButton: {
    width: "100%",
  },
});
