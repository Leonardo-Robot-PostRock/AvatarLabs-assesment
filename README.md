# Content Approval Engine

Sistema de aprobación de contenido para agencias y clientes.

## Quick Start

### Prerrequisitos
- Node.js 18+
- Cuenta de Supabase

### 1. Configurar Supabase
1. Crear proyecto en supabase.com
2. Ejecutar `supabase/setup.sql` en SQL Editor
3. Ejecutar `supabase/realtime.sql`

### 2. Configurar Variables
```bash
cp .env.example .env.local
# Editar con tus credenciales de Supabase
```

### 3. Instalar y ejecutar
```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Scripts
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build |
| `npm run test` | Tests |

## Características
- Dashboard con lista de contenidos
- Link público para clientes
- Approve/Reject con feedback
- Supabase Realtime
- Video embedding (YouTube/Vimeo)