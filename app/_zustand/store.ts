import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  slug?: string;
  title: string;
  price: number;
  image: string;
  amount: number;
  discountedPrice?: number;
  hasDiscount?: boolean;
  offerName?: string;
  discountType?: string;
  discountValue?: number;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find(
            (item) => item.id === newProduct.id
          );
          if (!cartItem) {
            state.products = [...state.products, newProduct];
          } else {
            state.products = state.products.map((product) => {
              if (product.id === cartItem.id) {
                return { ...product, amount: product.amount + newProduct.amount };
              }
              return product;
            });
          }
          // Auto-calculate totals
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            total += item.amount * (item.hasDiscount && item.discountedPrice !== undefined ? item.discountedPrice : item.price);
          });
          return { products: state.products, allQuantity: amount, total: total };
        });
      },
      clearCart: () => {
        set((state: any) => {
          
          return {
            products: [],
            allQuantity: 0,
            total: 0,
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          const products = state.products.filter(
            (product: ProductInCart) => product.id !== id
          );
          // Auto-calculate totals
          let amount = 0;
          let total = 0;
          products.forEach((item) => {
            amount += item.amount;
            total += item.amount * (item.hasDiscount && item.discountedPrice !== undefined ? item.discountedPrice : item.price);
          });
          return { products, allQuantity: amount, total: total };
        });
      },

      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            total += item.amount * (item.hasDiscount && item.discountedPrice !== undefined ? item.discountedPrice : item.price);
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
      updateCartAmount: (id, amount) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === id);

          if (!cartItem) {
            return { products: [...state.products] };
          }
          
          const products = state.products.map((product) => {
            if (product.id === cartItem.id) {
              return { ...product, amount };
            }
            return product;
          });
          
          // Auto-calculate totals
          let totalAmount = 0;
          let total = 0;
          products.forEach((item) => {
            totalAmount += item.amount;
            total += item.amount * (item.hasDiscount && item.discountedPrice !== undefined ? item.discountedPrice : item.price);
          });
          
          return { products, allQuantity: totalAmount, total: total };
        });
      },
    }),
    {
      name: "products-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
