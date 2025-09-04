FROM richarvey/nginx-php-fpm:3.1.6

# Laravel ルートで依存を入れる（キャッシュ効く）
WORKDIR /var/www/html/backend
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

# 残りのソースを配置
WORKDIR /var/www/html
COPY . .

# Web ルートは Laravel の public
ENV WEBROOT /var/www/html/backend/public

# もう vendor はあるので起動時 composer はスキップ
ENV SKIP_COMPOSER 1
ENV RUN_SCRIPTS 1
ENV PHP_ERRORS_STDERR 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# 失敗を早期検知（任意）
RUN test -f /var/www/html/backend/vendor/autoload.php

CMD ["/start.sh"]
