#!/bin/bash
set -e
cd /home/nanobot/.nanobot/workspace/luckyc-react
git remote set-url origin https://github.com/GrapeCoin/luckyc.git
git add -A
git commit -m "chore: rename to luckyc, add docs for GitHub Pages"
git push -u origin master --force