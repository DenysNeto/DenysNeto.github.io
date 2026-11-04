#!/bin/sh
# Publishes dist/ to the gh-pages branch, which GitHub Pages serves at https://denysneto.github.io
# (no GitHub Actions: pushing a workflow file needs an extra token scope). Run through `npm run deploy`.
set -e
cd dist
touch .nojekyll # serve files as they are, no Jekyll processing
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -q -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
echo "Deployed: https://denysneto.github.io"
