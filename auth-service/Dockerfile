# ── Etapa 1: imagen base ──────────────────────────────────────────
# Usamos una imagen oficial de Node.js ligera (alpine = versión mínima de Linux)
FROM node:20-alpine

# ── Etapa 2: directorio de trabajo dentro del contenedor ──────────
# Es como hacer "mkdir /app && cd /app" dentro del contenedor
WORKDIR /app

# ── Etapa 3: copiar dependencias primero ─────────────────────────
# Copiamos SOLO package.json antes que el código fuente.
# Truco de optimización: Docker cachea capas. Si el código cambia
# pero package.json no, Docker no reinstala las dependencias.
COPY package*.json ./

# ── Etapa 4: instalar dependencias ───────────────────────────────
RUN npm install --omit=dev

# ── Etapa 5: copiar el resto del código ──────────────────────────
COPY . .

# ── Etapa 6: exponer el puerto ───────────────────────────────────
# Documentación — le dice a Docker que este contenedor usa el 3001
EXPOSE 3001

# ── Etapa 7: comando de inicio ───────────────────────────────────
CMD ["node", "src/index.js"]