# ==============================================================================
# ESTÁGIO 1: COMPILAÇÃO DO FRONTEND (BUILD)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências aproveitando cache de camadas Docker
COPY package*.json ./
RUN npm ci

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

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]

