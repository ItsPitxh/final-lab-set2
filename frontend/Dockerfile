FROM nginx:1.25-alpine

COPY index.html    /usr/share/nginx/html/index.html
COPY activity.html /usr/share/nginx/html/activity.html
COPY config.js     /usr/share/nginx/html/config.js
COPY nginx.conf    /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
