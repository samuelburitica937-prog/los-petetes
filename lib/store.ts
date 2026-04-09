import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, qty?: number) => void;
    removeItem: (productId: string) => void;
    updateQty: (productId: string, qty: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    total: () => number;
    totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product, qty = 1) => {
                set(state => {
                    const existing = state.items.find(i => i.product.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map(i =>
                                i.product.id === product.id
                                    ? { ...i, quantity: i.quantity + qty }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, { product, quantity: qty }] };
                });
            },
            removeItem: (productId) =>
                set(state => ({ items: state.items.filter(i => i.product.id !== productId) })),
            updateQty: (productId, qty) =>
                set(state => ({
                    items: qty <= 0
                        ? state.items.filter(i => i.product.id !== productId)
                        : state.items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i),
                })),
            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            total: () => get().items.reduce((acc, i) => acc + i.product.precioMayorista * i.quantity, 0),
            totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
        }),
        { name: 'petetes-cart-v2' }
    )
);

interface WishlistStore {
    ids: string[];
    toggle: (id: string) => void;
    has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            ids: [],
            toggle: (id) =>
                set(state => ({
                    ids: state.ids.includes(id) ? state.ids.filter(i => i !== id) : [...state.ids, id],
                })),
            has: (id) => get().ids.includes(id),
        }),
        { name: 'petetes-wishlist-v2' }
    )
);

interface RecentStore {
    products: Product[];
    add: (product: Product) => void;
}

export const useRecentStore = create<RecentStore>()(
    persist(
        (set) => ({
            products: [],
            add: (product) =>
                set(state => {
                    const filtered = state.products.filter(p => p.id !== product.id);
                    return { products: [product, ...filtered].slice(0, 12) };
                }),
        }),
        { name: 'petetes-recent-v2' }
    )
);


