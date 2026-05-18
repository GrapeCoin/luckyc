#!/bin/bash
cd /home/nanobot/.nanobot/workspace/luckyc-react
git add -A
git commit -m "feat: LuckyC Number React rewrite with Kraken design system"
git remote add origin https://github.com/GrapeCoin/luckyc-react.git
git push -u origin master