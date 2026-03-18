FROM nginx:1.25-alpine

COPY index.html          /usr/share/nginx/html/index.html
COPY activity.html       /usr/share/nginx/html/activity.html
COPY config.js           /usr/share/nginx/html/config.js
COPY nginx.conf.template /nginx.conf.template

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# At startup: replace __PORT__ with Railway's $PORT, then run nginx
CMD ["/bin/sh", "-c", "sed \"s/__PORT__/${PORT:-80}/\" /nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
