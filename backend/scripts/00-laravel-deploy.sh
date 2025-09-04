#!/usr/bin/env bash
set -euo pipefail

echo "Running composer"
composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

# ★ 権限問題を避けるため、当面はキャッシュ生成しない
# php artisan config:cache
# php artisan route:cache

echo "Running migrations at runtime..."
 php artisan migrate --force

 # nginx用に ${PORT} を流し込む（テンプレにしている場合）
 if [ -f /etc/nginx/conf.d/default.conf.template ]; then
   envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
 fi

 echo "[prestart] done. Handing off to image /start.sh"
 exit 0
