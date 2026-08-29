#!/bin/sh
set -eu

origin=${1:-https://legacy-app-rescue.sociobot.in}
evidence=${2:-/work/.evidence/verify-url}

# This project-level URL check covers the worker baseline: route titles,
# language, main landmarks, image alternatives, console errors, mobile
# targets, real demo isolation, HTTP 404 behavior, and Axe serious/critical.
node scripts/verify-live.mjs "$origin" "$evidence"
