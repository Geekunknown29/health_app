FROM nginx:alpine

# Set default port to 8080 (Cloud Run uses 8080 by default)
ENV PORT=8080

# The standard nginx alpine image processes files in /etc/nginx/templates/ 
# and replaces environment variables using envsubst, saving the output to /etc/nginx/conf.d/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy the static files into the Nginx html directory
COPY . /usr/share/nginx/html

# Document the port that the container listens on
EXPOSE 8080
