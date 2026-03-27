-- ARCHIVO ORQUESTADO POR BACKEND AGENT
-- SCHEMA PARA LOS PETETES MAYORISTA (POSTGRESQL)

-- 1. Tabla de Categorías
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    description TEXT
);

-- 2. Tabla de Productos (Catálogo)
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio NUMERIC NOT NULL,
    precio_mayorista NUMERIC NOT NULL,
    stock INTEGER DEFAULT 0,
    categoria TEXT REFERENCES categories(id),
    descripcion TEXT,
    min_mayorista INTEGER DEFAULT 1,
    rating NUMERIC DEFAULT 5.0,
    vendidos INTEGER DEFAULT 0,
    destacado BOOLEAN DEFAULT false,
    nuevo BOOLEAN DEFAULT true,
    imagenes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Usuarios (Para manejar Admins y Clientes V.I.P)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    es_mayorista BOOLEAN DEFAULT false,
    es_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Pedidos (Orders)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id),
    estado TEXT DEFAULT 'pendiente', -- pendiente, pagado, despachado, cancelado
    total NUMERIC NOT NULL,
    metodo_pago TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Ítems del Pedido (Order Items)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id),
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC NOT NULL
);

-- NOTA: Insertar políticas de seguridad RLS (Row Level Security) después de crearlas desde el Dashboard.
