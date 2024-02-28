FROM node:latest AS builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Use NGINX base image to serve the React app
FROM nginx:latest

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# For BASE URL config use this
#COPY --from=builder /app/dist /usr/share/nginx/html/{PASTE YOUR BASE URL FROM ENV FILE}

# Copy custom NGINX configuration to adjust MIME types
COPY nginx.conf /etc/nginx/sites-enabled/default.conf

# Expose the port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]