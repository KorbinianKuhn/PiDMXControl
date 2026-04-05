 #!/bin/bash

set -euo pipefail

get_env_variable () {
    local variable_name="$1"
    if [[ -n "${!variable_name:-}" ]]; then
        echo "${!variable_name:-}"
    else
        echo "ERROR: Required environment variable '$variable_name' is not set!" >&2
        exit 1
    fi
}

BASE_REST_API=$(get_env_variable "BASE_REST_API")
MQTT_WS_URL=$(get_env_variable "MQTT_WS_URL")

cat <<EOF > /usr/share/nginx/html/assets/env.js
window.env = {
    BASE_REST_API: "${BASE_REST_API}",
    MQTT_WS_URL: "${MQTT_WS_URL}",
};
EOF

exec nginx -g "daemon off;"