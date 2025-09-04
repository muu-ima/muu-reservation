FROM richarvey/nginx-php-fpm:3.1.6

# アプリ一式
COPY . .

# 起動前スクリプト & nginx テンプレを配置（/start.sh が /scripts/*.sh を自動実行）
COPY backend/scripts/00-laravel-deploy.sh /scripts/00-laravel-deploy.sh
COPY nginx-site.conf /etc/nginx/sites-enabled/default.conf.template
COPY nginx-site.conf /etc/nginx/conf.d/default.conf.template
RUN chmod +x /scripts/00-laravel-deploy.sh

# 重要: Composer は /scripts で実行するので SKIP_COMPOSER=1 のまま
ENV SKIP_COMPOSER 1

# DocumentRoot を backend/public に（monorepo）
ENV WEBROOT /var/www/html/backend/public

# ログを STDERR に出す
ENV PHP_ERRORS_STDERR 1

# /scripts/*.sh を起動前に実行
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel ログの設定など
ENV APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# 起動はイメージ内蔵の /start.sh（= php-fpm + nginx を正しく起動）
CMD ["/start.sh"]
