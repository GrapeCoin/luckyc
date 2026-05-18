#!/bin/bash
set -e
cd /home/nanobot/.nanobot/workspace/luckyc-react
git add -A
git commit -m "fix: correct asset paths for GitHub Pages (/luckyc/)"
git push -u origin master