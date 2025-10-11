#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CERTS_DIR="${PROJECT_ROOT}/develop/certs"

generate_nginx_server_cert() {
  echo "Generating nginx server certificate (for browser TLS)..."
  openssl genrsa -out "${CERTS_DIR}/nginx-server.key" 2048
  openssl req -new -x509 -key "${CERTS_DIR}/nginx-server.key" \
    -out "${CERTS_DIR}/nginx-server.crt" \
    -days 365 \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=TacokumoNginx/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
}


mkdir -p "${CERTS_DIR}"

# Generate nginx server certificate
generate_nginx_server_cert

echo "Certificates generated successfully in ${CERTS_DIR}"
echo ""
echo "Nginx server certificates (browser TLS):"
echo "  - ${CERTS_DIR}/nginx-server.key"
echo "  - ${CERTS_DIR}/nginx-server.crt"
