FROM nginx:1.25-alpine

COPY index.html    /usr/share/nginx/html/index.html
COPY activity.html /usr/share/nginx/html/activity.html
COPY config.js     /usr/share/nginx/html/config.js

# Remove default config and write a PORT-aware template
RUN rm /etc/nginx/conf.d/default.conf && \
    printf 'server {\n  listen ${PORT};\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' \
    > /etc/nginx/conf.d/default.conf.template

# At startup: inject $PORT, then run nginx
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
