# Content Approval Engine 🚀

Sistema de aprobación de contenido para agencias creativas y sus clientes.

---

## ✨ Para el Cliente

### ¿Qué es esto?

Es una herramienta donde tu agencia te comparte un video para que lo revises y decidas si está aprobado o si necesita cambios.

### ¿Cómo funciona?

1. **Recibís un link** — Te llega por email o WhatsApp
2. **Abrís el link** — Ves el video directamente en el navegador
3. **Aprobás o rechazás** — Si rechazás, dejás comentarios de qué cambiar
4. **Listo** — La agencia recibe tu decisión al instante

### ¿Qué necesito?

- Un navegador (Chrome, Safari, Edge, Firefox)
- El link que te mandaron
- ¡Eso es todo! No hace falta crear cuenta ni.password

---

## 🛠️ Tecnologías

| Tecnología | Para qué |
|------------|----------|
| **Next.js 14** | Framework web (App Router) |
| **React 18** | Interfaz de usuario |
| **TypeScript** | Código más seguro y mantenible |
| **Tailwind CSS** | Estilos modernos y responsivos |
| **Supabase** | Base de datos + Realtime |
| **Lucide React** | Íconos |
| **Nanoid** | Tokens seguros para links |

### ¿Por qué estas tecnologías?

- **Next.js**: Deploy rápido a Vercel, rendimiento óptimo
- **Supabase Realtime**: Actualización instantánea sin recargar (como WhatsApp)
- **Tailwind**: UI bonita sin escribir CSS manualmente

---

## 📋 Requisitos del Sistema

### Desarrollador
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### Cliente
- Navegador moderno
- Conexión a internet

---

## 🚀 Cómo Configurar (Para Desarrolladores)

### 1. Clonar el proyecto

```bash
git clone <repo-url>
cd content-approval-app/frontend
```

### 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir al **SQL Editor** y ejecutar:

```sql
-- Tabla principal
CREATE TABLE IF NOT EXISTS content_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  public_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_token ON content_pieces(public_token);
CREATE INDEX idx_fecha ON content_pieces(created_at DESC);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE content_pieces;

-- Permisos (para desarrollo)
ALTER TABLE content_pieces DISABLE ROW LEVEL SECURITY;
```

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (tu anon key)
```

### 4. Instalar y ejecutar

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

---

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # Páginas de Next.js
│   ├── page.tsx             # Dashboard (agencia)
│   ├── review/[token]/      # Página del cliente
│   └── actions.ts           # Acciones del servidor
├── components/              # Componentes UI
│   ├── ui/                  # Componentes base (Button, Card, etc.)
│   ├── content-form.tsx     # Formulario de creación
│   └── content-list.tsx     # Lista de contenidos
├── features/content/        # Lógica de negocio
│   ├── service.ts           # Operaciones con Supabase
│   ├── types.ts             # Tipos TypeScript
│   └── utils.ts             # Utilidades (tokens, URLs)
├── lib/                     # Configuraciones
│   └── supabase.ts          # Cliente de Supabase
├── supabase/                # SQL
│   ├── setup.sql            # Schema de la base de datos
│   └── realtime.sql         # Habilitar Realtime
└── tests/                   # Tests unitarios
```

---

## 🧪 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (localhost:3000) |
| `npm run build` | Build de producción |
| `npm run start` | Ejecutar build de producción |
| `npm run test` | Ejecutar tests |
| `npm run lint` | Verificar código |

---

## 🎨 Diseño

- **Modo oscuro** por defecto
- **5-Star Branding**: Purpura, azul, amarillo
- **Gradientes suaves**
- **Responsive**: Funciona en móvil y desktop

---

## 📄 Licencia

MIT