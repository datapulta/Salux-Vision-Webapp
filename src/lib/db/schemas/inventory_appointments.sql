-- Archivo de migración (PostgreSQL) para Inventario y Citas Híbridas
-- Diseño basado en Lenskart + Sistema Optica para Salux Vision

-- 1. Tabla de Armazones (El Catálogo Físico Finito)
CREATE TABLE IF NOT EXISTS frames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,            -- Ej: "Hooper E15084M"
    brand VARCHAR(255),                    -- Ej: "RayBan" o "Generico"
    price DECIMAL(10, 2) NOT NULL,         -- Ej: 950.00
    stock INTEGER NOT NULL DEFAULT 0,      -- Ej: 5 unidades en bodega
    image_url TEXT,                        -- La foto para el catálogo
    color VARCHAR(100),                    -- Ej: "Rosa Transparente"
    size_category VARCHAR(50),             -- Ej: "Niños (5-8 años)", "Adulto M"
    status VARCHAR(50) DEFAULT 'active',   -- active, inactive (si se deja de vender), out_of_stock
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Tipos de Mica (El Wizard "Select Lens Type")
CREATE TABLE IF NOT EXISTS lens_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,            -- Ej: "With Power", "Zero Power", "Progressive"
    description TEXT,                      -- Ej: "Miopía, hipermetropía o astigmatismo común"
    base_price DECIMAL(10, 2) DEFAULT 0.00,-- Si alguna categoría cuesta más de entrada
    status VARCHAR(50) DEFAULT 'active'
);

-- 3. Tabla de Materiales/Tratamientos de Mica (Filtro Azul, Antirreflejante, etc.)
CREATE TABLE IF NOT EXISTS lens_treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,            -- Ej: "Filtro Azul (BLU)", "Antirreflejante (AR)"
    price_modifier DECIMAL(10, 2) DEFAULT 0.00, -- Ej: + $300 pesos si escogen filtro azul
    description TEXT,
    status VARCHAR(50) DEFAULT 'active'
);

-- 4. Recreación de la Tabla de Citas (Híbrida: Consulta + Carrito)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),       -- El paciente que agendó
    
    -- El bloque de la "Reserva Médica"
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',             -- pending, confirmed (por el admin), completed, cancelled
    
    -- El bloque del "Carrito / E-commerce"
    selected_frame_id UUID REFERENCES frames(id),     -- El armazón que apartó
    selected_lens_type_id UUID REFERENCES lens_types(id), -- El tipo de graduación que cree ocupar
    selected_treatments JSONB,                        -- Guardar un arreglo de IDs de tratamientos ej. ["id-filtro-azul", "id-ar"]
    
    -- Notas para el doctor
    patient_notes TEXT,                               -- Ej: "Quisiera pasar a recogerlos en la sucursal Centro"
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
