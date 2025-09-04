FROM richarvey/nginx-php-fpm:3.1.6

# あると安全
WORKDIR /var/www/html

# ソース一式
COPY . .

# ★ Laravel の public を指す（backend 配下ならココが核心）
ENV WEBROOT /var/www/html/backend/public

# 起動時に composer を実行させる
ENV SKIP_COMPOSER 0
ENV RUN_SCRIPTS 1
ENV PHP_ERRORS_STDERR 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]
