-- ============================================================
-- RLS ONLY — Sin CREATE TABLE (tablas ya existen)
-- Pegar en Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. ACTIVAR RLS
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;

-- 2. Borrar políticas viejas si existen (idempotente)
DROP POLICY IF EXISTS "profiles_select_own"   ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own"   ON profiles;
DROP POLICY IF EXISTS "orders_select_own"     ON orders;
DROP POLICY IF EXISTS "orders_insert_own"     ON orders;
DROP POLICY IF EXISTS "order_items_select_own" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
DROP POLICY IF EXISTS "products_read_all"     ON products;
DROP POLICY IF EXISTS "categories_read_all"   ON categories;

-- 3. POLÍTICAS: profiles
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. POLÍTICAS: orders
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 5. POLÍTICAS: order_items
CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.profile_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.profile_id = auth.uid()
    )
  );

-- 6. POLÍTICAS: products y categories (catálogo público)
CREATE POLICY "products_read_all"   ON products   FOR SELECT USING (true);
CREATE POLICY "categories_read_all" ON categories FOR SELECT USING (true);

-- 7. TRIGGER: crear perfil automático al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, es_mayorista)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'es_mayorista')::boolean, true)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. VERIFICACIÓN FINAL
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles','orders','order_items','products','categories');
