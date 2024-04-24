FROM node:18-alpine as builder

WORKDIR /freelancer
COPY package.json ./

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /freelancer/dist /var/www/freelancers.gigitise.com

# COPY ./nginx/freelancers.gigitise.com /etc/nginx/sites-available