#!/bin/bash

# daily-backup.sh
# useful for the dokku server
# dokku's backup feature is broken atm https://github.com/dokku/dokku-postgres/issues/274
# backups are exported from dokku:postgres plugin before being sent to b2


filename="$(date +'%Y-%m-%d_%H-%M-%S').psql"

dokku postgres:export futureporn-db > "${filename}"
b2-linux upload-file futureporn-db-backup "./${filename}" "${filename}"

