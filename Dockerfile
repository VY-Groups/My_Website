#FROM node:24-alpine

#RUN mkdir -p /app

#WORKDIR /app

#COPY . . /app/

#RUN npm install

#RUN npm test && npm run build 

#CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

#EXPOSE 5173 




# Build stage
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]



