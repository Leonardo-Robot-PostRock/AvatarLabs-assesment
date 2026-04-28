# Content Approval Engine

Sistema de aprobación de contenido con interfaz moderna para agencias y clientes.

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### 1. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En el **SQL Editor**, pega el contenido de `supabase/setup.sql`
3. Ejecuta el script
4. **Habilitar Realtime**: Ejecuta también `supabase/realtime.sql`

### 2. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

**Cómo obtener las credenciales:**
- `NEXT_PUBLIC_SUPABASE_URL`: Project Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API →anon public key

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Ejecutar build |
| `npm run test` | Tests unitarios |
| `npm run lint` | Verificar código |

## 🧪 Testing

```bash
npm run test
```

18 tests unitarios covering:
- Generación de tokens
- Validación de URLs de video
- Conversión a embeds

## 🎨 Características

- **Dashboard**: Lista de contenidos con estados (pending/approved/rejected)
- **Link público**: Comparte con clientes via `/review/[token]`
- **Aprobación/Rechazo**: Botones grandes, feedback requerido al rechazar
- **Tiempo Real**: Supabase Realtime + fallback polling cada 3s
- **Video embedding**: YouTube y Vimeo automáticamente

## 📁 Estructura

```
app/
├── page.tsx              # Dashboard
├── review/[token]/page.tsx  # Página del cliente
components/               # Componentes UI
features/content/         # Lógica de negocio
lib/                     # Supabase client
tests/                   # Tests unitarios
supabase/setup.sql        # Schema de BD
```

## 🐛 Troubleshooting

### "Database not available"
- Verifica que las credenciales en `.env.local` sean correctas
- Ejecuta el SQL de `supabase/setup.sql` en tu Supabase

### Error de build
- Asegúrate de tener las variables de entorno configuradas
- Ejecuta `npm run build` con las vars: `NEXT_PUBLIC_SUPABASE_URL=x NEXT_PUBLIC_SUPABASE_ANON_KEY=x npm run build`

## 📄 Licencia

MIT