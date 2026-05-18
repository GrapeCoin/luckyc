#!/bin/bash
set -e
cd /home/nanobot/.nanobot/workspace/luckyc-react
npm run build
git add -A
git commit -m "fix: remove eager provider init to avoid crash without MetaMask" --allow-empty
git push