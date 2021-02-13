### STAGE 2: Setup ###
FROM httpd:alpine

## Copy our default httpd config
COPY ./httpd.conf /usr/local/apache2/conf/
COPY ./httpd-vhosts.conf /usr/local/apache2/conf/extra/

## Remove default apache website
RUN rm -r /usr/local/apache2/htdocs/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY ./dist/sandboxAndMerchant /usr/local/apache2/htdocs/

# https://github.com/jonathanheilmann/docker-httpd-alpine-rewrite/blob/8f7f686097986fc645889e84b4f55217a57f417c/Dockerfile#L4
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf

# copy the htaccess file used to get pretty urls in angular
COPY ./.htaccess /usr/local/apache2/htdocs/

CMD apachectl -D FOREGROUND
