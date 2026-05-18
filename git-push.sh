#!/bin/bash
set -e
cd /home/nanobot/.nanobot/workspace/luckyc-react
npm run build
mkdir -p dist-html
cp dist/index.html dist-html/index.html
git add -A
git commit -m "ci: add GitHub Actions workflow for auto-deploy to Pages" --allow-empty
git push