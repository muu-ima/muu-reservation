FROM richarvey/nginx-php-fpm:3.1.6

# アプリ本体（backend 配下だけ）を配置
COPY backend/ /var/www/html/backend

# 起動前スクリプト & nginx テンプレ配置（/start.sh が /scripts/*.sh を自動実行）
COPY backend/scripts/00-laravel-deploy.sh /scripts/00-laravel-deploy.sh
COPY conf/nginx/nginx-site /etc/nginx/sites-enabled/default.conf.template
COPY conf/nginx/nginx-site /etc/nginx/conf.d/default.conf.template
RUN chmod +x /scripts/00-laravel-deploy.sh

# composer は /scripts で実行するのでスキップ（重複防止）
ENV SKIP_COMPOSER 1

# DocumentRoot（monorepo: backend/public）
ENV WEBROOT /var/www/html/backend/public

# ログを STDERR に
ENV PHP_ERRORS_STDERR 1

# /scripts/*.sh を起動前に実行
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel ログ設定など
ENV APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# 起動は内蔵 /start.sh（= php-fpm + nginx）
CMD ["/start.sh"]
