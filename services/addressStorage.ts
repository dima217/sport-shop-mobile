import AsyncStorage from "@react-native-async-storage/async-storage";

const ADDRESSES_KEY = "user_addresses";

export interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export const addressStorage = {
  async getAddresses(): Promise<Address[]> {
    try {
      const data = await AsyncStorage.getItem(ADDRESSES_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.warn("addressStorage.getAddresses error", error);
      return [];
    }
  },

  async saveAddresses(addresses: Address[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
    } catch (error) {
      console.warn("addressStorage.saveAddresses error", error);
      throw error;
    }
  },

  async addAddress(address: Omit<Address, "id">): Promise<Address> {
    const addresses = await this.getAddresses();
    const newAddress: Address = {
      ...address,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    addresses.push(newAddress);
    await this.saveAddresses(addresses);
    return newAddress;
  },

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    const addresses = await this.getAddresses();
    const index = addresses.findIndex((addr) => addr.id === id);
    if (index === -1) return null;

    addresses[index] = { ...addresses[index], ...updates };
    await this.saveAddresses(addresses);
    return addresses[index];
  },

  async deleteAddress(id: string): Promise<boolean> {
    const addresses = await this.getAddresses();
    const filtered = addresses.filter((addr) => addr.id !== id);
    await this.saveAddresses(filtered);
    return filtered.length !== addresses.length;
  },

  async setDefaultAddress(id: string): Promise<void> {
    const addresses = await this.getAddresses();
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    await this.saveAddresses(updated);
  },

  async removeDefaultAddress(id: string): Promise<void> {
    const addresses = await this.getAddresses();
    const updated = addresses.map((addr) =>
      addr.id === id ? { ...addr, isDefault: false } : addr
    );
    await this.saveAddresses(updated);
  },

  async getDefaultAddress(): Promise<Address | null> {
    const addresses = await this.getAddresses();
    return addresses.find((addr) => addr.isDefault) || null;
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ADDRESSES_KEY);
    } catch (error) {
      console.warn("addressStorage.clearAll error", error);
    }
  },
};

