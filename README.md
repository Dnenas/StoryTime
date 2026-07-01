# StoryTime 🎀

El muro anónimo donde tu comunidad cuenta sus historias — con captura de leads privada para ti.

---

## Antes de empezar: cómo funciona

- **Feed público**: cualquiera lee las historias sin ver quién las escribió.
- **Publicar**: pide nombre, correo y celular antes de dejar la historia. Esos datos NUNCA se muestran en público.
- **Panel privado** (`/` → botón "panel privado" al final): solo tú, con tu correo y contraseña, puedes ver los leads (nombre, correo, celular) de cada historia.

---

## Paso 1 — Crear tu proyecto en Supabase (la base de datos)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratis (puedes entrar con GitHub o Google).
2. Clic en **"New project"**.
   - Ponle un nombre, ej: `storytime`
   - Crea una contraseña para la base de datos (guárdala, no la necesitarás seguido pero es buena práctica guardarla).
   - Elige la región más cercana a tu audiencia (ej. `South America` si tu público es LATAM).
3. Espera 1-2 minutos a que se cree el proyecto.

### 1.1 — Crear la tabla de historias

1. En el menú lateral, ve a **SQL Editor**.
2. Clic en **"New query"**.
3. Abre el archivo `supabase-setup.sql` (incluido en este proyecto), copia TODO su contenido y pégalo ahí.
4. Clic en **"Run"** (o Ctrl+Enter). Deberías ver "Success. No rows returned".

Esto crea la tabla `stories`, las reglas de seguridad (para que el público solo pueda leer/publicar, nunca ver datos personales), y una vista pública separada sin datos sensibles.

### 1.2 — Crear tu usuario de administrador (para entrar al panel)

1. En el menú lateral, ve a **Authentication** → **Users**.
2. Clic en **"Add user"** → **"Create new user"**.
3. Pon el correo y contraseña con los que TÚ entrarás al panel privado del sitio (esto es distinto a tu cuenta de Supabase).
4. Guarda ese correo/contraseña — es tu login del panel.

### 1.3 — Obtener tus llaves de conexión

1. Ve a **Project Settings** (ícono de engranaje) → **API**.
2. Copia estos dos valores, los necesitarás en el siguiente paso:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una llave larga tipo `eyJhbGc...`)

---

## Paso 2 — Probar el sitio en tu computadora (opcional pero recomendado)

1. Instala [Node.js](https://nodejs.org) si no lo tienes (versión 18 o superior).
2. Abre una terminal en la carpeta del proyecto.
3. Copia el archivo de ejemplo de variables de entorno:
   ```
   cp .env.example .env
   ```
4. Abre `.env` y pega tu **Project URL** y **anon public key** de Supabase:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
5. Instala dependencias y corre el proyecto:
   ```
   npm install
   npm run dev
   ```
6. Abre el link que te muestre la terminal (normalmente `http://localhost:5173`).

---

## Paso 3 — Subir el código a GitHub

Netlify se conecta a un repositorio de GitHub para hacer el deploy automático.

1. Crea una cuenta en [github.com](https://github.com) si no tienes.
2. Crea un repositorio nuevo (puede ser privado), ej: `storytime`.
3. Sube el código:
   ```
   git init
   git add .
   git commit -m "StoryTime listo para deploy"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/storytime.git
   git push -u origin main
   ```

> **Importante**: el archivo `.env` NO se sube (está en `.gitignore` a propósito), porque contiene datos que configurarás directo en Netlify.

---

## Paso 4 — Desplegar en Netlify

1. Ve a [netlify.com](https://netlify.com) y crea una cuenta gratis.
2. Clic en **"Add new site"** → **"Import an existing project"**.
3. Conecta tu cuenta de GitHub y elige el repositorio `storytime`.
4. Netlify va a detectar automáticamente la configuración gracias al archivo `netlify.toml` (build command: `npm run build`, carpeta: `dist`). No cambies nada ahí.
5. Antes de hacer clic en "Deploy", ve a **"Add environment variables"** y agrega:
   - `VITE_SUPABASE_URL` = tu Project URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon public key de Supabase
6. Clic en **"Deploy site"**.
7. En 1-2 minutos tendrás tu link público, tipo `https://storytime-xxxx.netlify.app`.

### Cambiar el nombre del link (opcional)

En Netlify: **Site settings** → **Change site name** → pon algo como `storytime-tuusuario` para que el link sea `storytime-tuusuario.netlify.app`.

### Usar tu propio dominio (opcional)

En Netlify: **Domain settings** → **Add a domain** y sigue las instrucciones para conectar un dominio que hayas comprado (ej. en Namecheap, GoDaddy, etc.).

---

## Cómo entrar a tu panel privado

1. Entra al sitio → clic en "panel privado" (al final de la página).
2. Usa el correo y contraseña que creaste en el paso **1.2**.
3. Ahí verás cada historia junto con el nombre, correo y celular de quien la publicó.

---

## Uso recomendado para Instagram

- Pon el link del sitio en tu bio o en el sticker de "link" en tus stories.
- Gancho sugerido: *"mira lo que está contando la gente 👀"* o *"cuenta tu historia sin que nadie sepa que fuiste tú"*.
- Cada quien que quiera publicar (no solo leer) te deja un lead de forma natural.

---

## Nota legal importante

Estás recolectando datos personales (nombre, correo, celular). Antes de mandar tráfico real:
- Agrega un aviso de privacidad simple en el formulario de publicar (ej. "tus datos son confidenciales, no se comparten con terceros y solo se usan para contactarte").
- Revisa la ley de protección de datos de tu país (en México: LFPDPPP; en Colombia: Ley 1581; etc.) para asegurarte de cumplir con los requisitos básicos de aviso y consentimiento.
