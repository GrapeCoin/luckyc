#!/bin/bash
set -e
cd /home/nanobot/.nanobot/workspace/luckyc-react
git add -A
git commit -m "ci: fix GitHub Actions - add environment name for Pages deployment" --allow-empty
git push