# ==============================================================================
# ESTÁGIO 1: COMPILAÇÃO DO FRONTEND (BUILD)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências do frontend
COPY package*.json ./
RUN npm install

# URL pública do backend, definida em tempo de build (Vite não lê env vars em runtime)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copia código-fonte e gera o build estático de produção em /app/dist
COPY . .
RUN npm run build

# ==============================================================================
# ESTÁGIO 2: SERVIDOR WEB DE PRODUÇÃO (NGINX)
# ==============================================================================
FROM nginx:alpine

# Copia os arquivos compilados para a pasta servida pelo Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia arquivo de configuração customizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

