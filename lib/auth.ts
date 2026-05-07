import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

interface PeteteCode {
    emoji: string;
    code: string;
    used: boolean;
}

export interface Order {
    id: string;
    fecha: string;
    total: number;
    estado: string;
    items: number;
}

interface User {
    id: string;
    nombre: string;
    email: string;
    esMayorista: boolean;
    intereses?: string[];
    totalCompras?: number;
    pedidosList?: Order[];
    metodosPago?: string[];
    myPetetes?: PeteteCode[];
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (email: string, pass: string, nombre: string, esMayorista: boolean, intereses?: string[], metodosPago?: string[]) => Promise<boolean>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
    updatePaymentMethods: (methods: string[]) => void;
    buyPetete: (emoji: string) => void;
    usePetete: (code: string) => void;
    addOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            initialize: async () => {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user) {
                  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                  const metaIntereses = session.user.user_metadata?.intereses || [];
                  set({ 
                      user: {
                          id: session.user.id,
                          email: session.user.email!,
                          nombre: profile?.nombre || session.user.email?.split('@')[0] || 'Usuario',
                          esMayorista: profile?.es_mayorista || false,
                          intereses: metaIntereses,
                          metodosPago: session.user.user_metadata?.metodosPago || []
                      },
                      isAuthenticated: true 
                  });
              }
            },
            login: async (email, pass) => {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
                if (error) {
                    toast.error(error.message);
                    return false;
                }
                if (data.user) {
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
                    const metaIntereses = data.user.user_metadata?.intereses || [];
                    set({ 
                        user: {
                            id: data.user.id,
                            email: data.user.email!,
                            nombre: profile?.nombre || data.user.email?.split('@')[0] || 'Usuario',
                            esMayorista: profile?.es_mayorista || false,
                            intereses: metaIntereses,
                            metodosPago: data.user.user_metadata?.metodosPago || []
                        },
                        isAuthenticated: true 
                    });
                    toast.success('¡Bienvenido de nuevo!');
                    return true;
                }
                return false;
            },
            register: async (email, pass, nombre, esMayorista, intereses = [], metodosPago = ['Bancolombia', 'Nequi']) => {
                const { data, error } = await supabase.auth.signUp({ 
                    email, 
                    password: pass,
                    options: {
                        data: { nombre, es_mayorista: esMayorista, intereses, metodosPago }
                    }
                });
                if (error) {
                    toast.error(error.message);
                    return false;
                }
                if (data.user) {
                    // Create profile if it doesn't trigger automatically via DB function
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        email,
                        nombre,
                        es_mayorista: esMayorista
                    });
                    
                    set({ 
                        user: {
                            id: data.user.id,
                            email,
                            nombre,
                            esMayorista,
                            intereses,
                            metodosPago
                        },
                        isAuthenticated: true 
                    });
                    toast.success('¡Cuenta creada con éxito!');
                    return true;
                }
                return false;
            },
            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
                toast.success('Sesión cerrada');
            },
            updatePaymentMethods: (methods: string[]) => {
                set((state) => {
                    if (state.user) {
                        return { user: { ...state.user, metodosPago: methods } };
                    }
                    return state;
                });
                toast.success('Métodos de pago actualizados');
            },
            buyPetete: (emoji: string) => {
                const newCode = 'DESC1-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                set((state) => {
                    if (state.user) {
                        const currentPetetes = state.user.myPetetes || [];
                        return { user: { ...state.user, myPetetes: [...currentPetetes, { emoji, code: newCode, used: false }] } };
                    }
                    return state;
                });
                toast.success('¡Petete comprado! Código generado.');
            },
            usePetete: (code: string) => {
                set((state) => {
                    if (state.user && state.user.myPetetes) {
                        const updatedPetetes = state.user.myPetetes.map(p => p.code === code ? { ...p, used: true } : p);
                        return { user: { ...state.user, myPetetes: updatedPetetes } };
                    }
                    return state;
                });
            },
            addOrder: (order: Order) => {
                set((state) => {
                    if (state.user) {
                        const currentOrders = state.user.pedidosList || [];
                        const currentTotal = state.user.totalCompras || 0;
                        return { 
                            user: { 
                                ...state.user, 
                                pedidosList: [order, ...currentOrders],
                                totalCompras: currentTotal + order.total
                            } 
                        };
                    }
                    return state;
                });
            }
        }),
        { name: 'petetes-auth' }
    )
);
