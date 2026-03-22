#!/usr/bin/env python3
"""Patch .env for production MariaDB + Reverb. Reads DB password from argv or env DB_PASS."""
import os
import re
import sys
from pathlib import Path

def main():
    env_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".env")
    db_pass = os.environ.get("DB_PASS") or (sys.argv[2] if len(sys.argv) > 2 else "")
    if not db_pass.strip():
        print("Set DB_PASS env or pass as second arg", file=sys.stderr)
        sys.exit(1)
    text = env_path.read_text(encoding="utf-8")

    def set_line(pattern: str, replacement: str, flags=0):
        nonlocal text
        if re.search(pattern, text, flags | re.MULTILINE):
            text = re.sub(pattern, replacement, text, count=1, flags=flags | re.MULTILINE)
        else:
            text = text.rstrip() + "\n" + replacement + "\n"

    set_line(r"^APP_NAME=.*", 'APP_NAME="Messenger"')
    set_line(r"^APP_ENV=.*", "APP_ENV=production")
    set_line(r"^APP_DEBUG=.*", "APP_DEBUG=false")
    set_line(r"^APP_URL=.*", "APP_URL=http://89.169.157.77")

    set_line(r"^DB_CONNECTION=.*", "DB_CONNECTION=mysql")
    set_line(r"^# DB_HOST=.*", "DB_HOST=127.0.0.1")
    set_line(r"^# DB_PORT=.*", "DB_PORT=3306")
    set_line(r"^# DB_DATABASE=.*", "DB_DATABASE=messenger")
    set_line(r"^# DB_USERNAME=.*", "DB_USERNAME=messenger")
    set_line(r"^# DB_PASSWORD=.*", f"DB_PASSWORD={db_pass}")

    set_line(r"^BROADCAST_CONNECTION=.*", "BROADCAST_CONNECTION=reverb")

    if "REVERB_APP_ID=" not in text:
        text = text.rstrip() + "\n\nREVERB_APP_ID=app\nREVERB_APP_KEY=key\nREVERB_APP_SECRET=secret\nREVERB_HOST=127.0.0.1\nREVERB_PORT=8080\nREVERB_SCHEME=http\n\nVITE_REVERB_APP_KEY=\"${REVERB_APP_KEY}\"\nVITE_REVERB_HOST=\"${REVERB_HOST}\"\nVITE_REVERB_PORT=\"${REVERB_PORT}\"\nVITE_REVERB_SCHEME=\"${REVERB_SCHEME}\"\n"

    env_path.write_text(text, encoding="utf-8")
    print("ok", env_path)

if __name__ == "__main__":
    main()
