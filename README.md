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

- Un navegador moderno
- El link que te mandaron
- ¡Eso es todo! No hace falta crear cuenta

---

## 🛠️ Tecnologías

| Tecnología | Para qué |
|------------|----------|
| **Next.js 16** | Framework web más rápido |
| **React 19** | Interfaz de usuario |
| **TypeScript** | Código typesafe |
| **Tailwind CSS** | Estilos modernos y responsivos |
| **shadcn/ui** | Componentes accesibles y bellos |
| **Supabase** | Base de datos + Realtime |

---

## 📋 Requisitos del Sistema

### Desarrollador
- Node.js 18+
- npm

### Cliente
- Navegador moderno
- Conexión a internet

---

## 🚀 Cómo Configurar (Para Desarrolladores)

### 1. Clonar el proyecto

```bash
git clone <repo-url>
cd frontend
```

### 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir al **SQL Editor** y ejecutar `supabase/setup.sql`
3. Ejecutar `supabase/realtime.sql`

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
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
│   └── actions.ts           # Server actions
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── content-form.tsx      # Formulario de creación
│   ├── content-list.tsx     # Lista de contenidos
│   ├── logo.tsx             # Logo 5 estrellas
│   └── status-badge.tsx     # Badge de estado
├── features/content/       # Lógica de negocio
│   ├── service.ts           # Operaciones DB
│   ├── types.ts              # Tipos TypeScript
│   └── utils.ts              # Utilidades
├── lib/                     # Configuraciones
│   └── supabase.ts          # Cliente de Supabase
├── supabase/                # SQL
│   ├── setup.sql           # Schema
│   └── realtime.sql        # Realtime
└── components.json         # shadcn config
```

---

## 🧪 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Ejecutar build |
| `npm run test` | Tests unitarios |
| `npm run lint` | Verificar código |

---

## 🎨 Diseño y UI

- **Modo oscuro** por defecto
- **5-Star Branding**: Purpura, azul, amarillo
- **Responsive**: Mobile first, funciona en móvil y desktop
- **shadcn/ui**: Componentes accesibles con variantes

---

## 📦 Dependencies Aggregated

```json
{
  "@radix-ui/react-slot": "^1.1.0",
  "@base-ui/react": "^7.0.0",
  "@supabase/supabase-js": "^2.47.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "lucide-react": "^0.460.0",
  "nanoid": "^5.0.8",
  "next": "^16.2.4",
  "react": "^19.0.0",
  "tailwind-merge": "^2.6.0"
}
```

---

## 📄 Licencia

MIT