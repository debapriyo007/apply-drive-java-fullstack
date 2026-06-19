# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build:portal
RUN npm run build:admin

# Stage 2: Serve using Nginx
FROM nginx:alpine
# Copy portal builds
COPY --from=build /app/public-portal/dist /usr/share/nginx/html/portal
COPY --from=build /app/admin-portal/dist /usr/share/nginx/html/admin
# Copy Nginx server blocks config
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
