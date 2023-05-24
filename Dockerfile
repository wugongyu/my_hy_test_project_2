FROM registry.jianke.com/library/nginx:1.14

WORKDIR /usr/src/app/

COPY ./nginx.template /etc/nginx/conf.d/nginx.template

COPY ./dist  /usr/share/nginx/html/
COPY ./public/env  /usr/share/nginx/html/

EXPOSE 8080

CMD envsubst '$API_HOST $JK_PROFILE' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
