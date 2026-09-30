#!/usr/bin/env bash
# Cache busting: acrescenta ?v=<hash do arquivo> nos CSS/JS referenciados pelos HTMLs.
# O navegador guarda CSS/JS por 1 semana (.htaccess), entao sem isso visitantes
# continuam com a versao antiga depois de um deploy. O HTML e no-cache, entao a
# URL nova chega na hora; e o hash so muda quando o arquivo muda.
set -euo pipefail

for f in $(grep -hoE 'assets/(css|js)/[A-Za-z0-9._-]+\.(css|js)' *.html | sort -u); do
  [ -f "$f" ] || continue
  h=$(sha1sum "$f" | cut -c1-8)
  sed -i "s#\"$f\"#\"$f?v=$h\"#g" *.html
done
