#!/usr/bin/env bash
set -euo pipefail
trap 'code=$?; echo "[prestart][ERROR] failed at line $LINENO (exit $code)"; exit $code' ERR

# Laravel ルート（monorepo: backend）
cd /var/www/html/backend

echo "[prestart] composer install..."
if ! command -v composer >/dev/null 2>&1; then
  echo "[prestart][ERROR] composer not found in image"
  exit 1
fi
composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

echo "[prestart] migrate..."
php artisan migrate --force

echo "[prestart] render nginx templates with \$PORT..."
pairs=(
  "/etc/nginx/sites-enabled/default.conf.template:/etc/nginx/sites-enabled/default.conf"
  "/etc/nginx/conf.d/default.conf.template:/etc/nginx/conf.d/default.conf"
)
for pair in "${pairs[@]}"; do
  IFS=: read -r tpl out <<<"$pair"
  if [ -f "$tpl" ]; then
    if command -v envsubst >/dev/null 2>&1; then
      envsubst '$PORT' < "$tpl" > "$out"
    else
      sed "s/\${PORT}/${PORT}/g" "$tpl" > "$out"
    fi
  fi
done

echo "[prestart] nginx -t..."
nginx -t

echo "[prestart] done. handoff to image /start.sh"
exit 0
BASH
chmod +x backend/scripts/00-laravel-deploy.sh