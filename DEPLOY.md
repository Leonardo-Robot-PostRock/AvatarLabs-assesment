# Deploy Guide

## 🚀 Opciones de Deploy

### Vercel (Recomendado)

Vercel es la forma más rápida y recomendada para Next.js.

#### Pasos

1. **Sube tu código a GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Crea un repositorio en GitHub**
   - Ve a [github.com/new](https://github.com/new)
   - Nama tu repositorio y crea

3. **Conecta a Vercel**

   ```bash
   # Instala Vercel CLI (opcional)
   npm i -g vercel

   # O usa la UI web:
   # ve a vercel.com y conecta tu GitHub
   ```

4. **Deploy desde UI**

   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio
   - Framework Preset: **Next.js**
   - En **Environment Variables**, agrega:
     - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu key

5. **Deploy!** 

   Click en "Deploy" y espera ~1 minuto.

#### Configurar Supabase para Producción

1. **Habilitar Realtime**:
   - Ejecuta `supabase/realtime.sql` en tu SQL Editor

2. **Permitir conexiones desde Vercel**:

   - **Project Settings → Network**
   - **Add allowed domains**
   - Agrega: `*.vercel.app` y `*.now.sh`

---

### Alternativa: Docker

Si prefieres Docker:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN NEXT_PUBLIC_SUPABASE_URL=x NEXT_PUBLIC_SUPABASE_ANON_KEY=x npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Habilita standalone output en `next.config.js`:

```js
module.exports = {
  output: 'standalone',
  // ... otras config
}
```

---

## 🔧 Variables de Entorno en Producción

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key anónima de Supabase |

## 🌐 Dominio Personalizado

### Vercel

1. **Settings → Domains**
2. Agrega tu dominio
3. Configura los DNS según las instrucciones

### Supabase

En producción, asegúrate de:
- **Authentication → URL Configuration**: Agrega tu dominio
- **Project Settings → API**: Verifica que funcione

## 📊 Monitoreo

### Vercel
- Dashboard → Analytics (gratis)
- Dashboard → Functions (para Server Actions)

### Errores
- Vercel notifica por email cuando hay errores
- Revisa **Dashboard → Errors**

## 🔄 Deploy Continuo

Cada push a `main` trigger:

1. Vercel detecta el cambio
2. Runs `npm run build`
3. Deploy automático
4. Preview deployments para PRs

## ⚡ Optimizaciones Post-Deploy

1. **Supabase Connection Pooling** (opcional):
   - Para muchas conexiones, usa pooler de Supabase

2. **Edge Functions** (avanzado):
   - Para validación de tokens server-side

---

## ❓ FAQ

**¿Puedo usar otro proveedor besides Vercel?**
Sí, funciona en Netlify, Railway, Render. Solo configura las variables de entorno.

**¿El video se reproduce en producción?**
Sí, el embedding de YouTube/Vimeo funciona automáticamente.

**¿Necesito SSL?**
Vercel provee HTTPS automáticamente.

**¿Cuánto cuesta?**
- Vercel: Gratis hasta 100k deployments/mes
- Supabase: Gratis hasta 500MB, 2GB bandwidth