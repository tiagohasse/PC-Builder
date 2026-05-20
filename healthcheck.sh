#!/bin/sh
# Script de monitoramento utilizando o Wget nativo do Alpine Linux

wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1
