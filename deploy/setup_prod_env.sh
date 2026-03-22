#!/bin/bash
# Run on server from /home/chat/messenger after .env created from .env.example
set -euo pipefail
ROOT="${1:-/home/chat/messenger}"
cd "$ROOT"

DB_PASS="$(cat /home/chat/.db_pass_messenger)"
PUBLIC_HOST="${PUBLIC_HOST:-89.169.157.77}"
export PUBLIC_HOST

cp -n .env.example .env
php artisan key:generate --force

export DB_PASS
python3 <<'PY'
import os, re, pathlib
p = pathlib.Path(".env")
t = p.read_text(encoding="utf-8")
db = os.environ["DB_PASS"]

def rep(pat, val, flags=re.MULTILINE):
    global t
    if re.search(pat, t, flags):
        t = re.sub(pat, val, t, count=1, flags=flags)
    else:
        t = t.rstrip() + "\n" + val + "\n"

rep(r"^APP_NAME=.*", 'APP_NAME="Messenger"')
rep(r"^APP_ENV=.*", "APP_ENV=production")
rep(r"^APP_DEBUG=.*", "APP_DEBUG=false")
rep(r"^APP_URL=.*", f"APP_URL=http://{os.environ['PUBLIC_HOST']}")

rep(r"^DB_CONNECTION=.*", "DB_CONNECTION=mysql")
rep(r"^# DB_HOST=.*", "DB_HOST=127.0.0.1")
rep(r"^# DB_PORT=.*", "DB_PORT=3306")
rep(r"^# DB_DATABASE=.*", "DB_DATABASE=messenger")
rep(r"^# DB_USERNAME=.*", "DB_USERNAME=messenger")
rep(r"^# DB_PASSWORD=.*", f"DB_PASSWORD={db}")

rep(r"^BROADCAST_CONNECTION=.*", "BROADCAST_CONNECTION=reverb")

p.write_text(t, encoding="utf-8")
print("base ok")
PY

RID=$(openssl rand -hex 6)
RKEY=$(openssl rand -hex 16)
RSEC=$(openssl rand -hex 20)

{
  echo ""
  echo "REVERB_APP_ID=${RID}"
  echo "REVERB_APP_KEY=${RKEY}"
  echo "REVERB_APP_SECRET=${RSEC}"
  echo "REVERB_HOST=${PUBLIC_HOST}"
  echo "REVERB_PORT=8080"
  echo "REVERB_SCHEME=http"
  echo "VITE_PUSHER_APP_KEY=${RKEY}"
  echo "VITE_PUSHER_APP_CLUSTER=mt1"
  echo "VITE_PUSHER_HOST=${PUBLIC_HOST}"
  echo "VITE_PUSHER_PORT=8080"
  echo "VITE_PUSHER_SCHEME=http"
} >> .env

echo "reverb keys appended"
php artisan config:clear
