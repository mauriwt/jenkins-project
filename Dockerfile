#Primera Etapa
FROM node:14.21-alpine as build-step

WORKDIR /ClientApp

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

#Segunda Etapa
FROM nginx:1.23.4-alpine
	#Si estas utilizando otra aplicacion cambia PokeApp por el nombre de tu app
COPY --from=build-step /ClientApp/dist/ClientApp /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
