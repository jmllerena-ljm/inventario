FROM node:14.16.0 as InventarioApi
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 

COPY . .
RUN npm run build

#Deploy
FROM node:14.16.0
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY --from=InventarioApi /usr/src/app/build/src .
COPY .env ./
#Puerto para Inventario
#EXPOSE 3977
#Puerto para Maxpi
EXPOSE 3978
CMD ["node", "index.js"]