#!/bin/sh
set -e

# Create runtime config file from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.ENV = {
  VITE_AUTH0_DOMAIN: "${VITE_AUTH0_DOMAIN}",
  VITE_AUTH0_CLIENT_ID: "${VITE_AUTH0_CLIENT_ID}",
  VITE_AUTH0_AUDIENCE: "${VITE_AUTH0_AUDIENCE}",
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}"
};
EOF

echo "Runtime configuration created:"
cat /usr/share/nginx/html/config.js

# Execute the CMD
exec "$@"
