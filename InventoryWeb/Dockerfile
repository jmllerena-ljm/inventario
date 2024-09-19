FROM node:14.16.0 as InventarioWeb
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 

COPY . .
RUN npm run build

#Deploy

FROM nginx:1.13.12-alpine as production-stage
COPY --from=InventarioWeb /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]