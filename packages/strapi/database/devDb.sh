#!/bin/bash

. .env

# Check if the containers already exist
pgadmin_exists=$(docker ps -a --filter "name=pgadmin" --format '{{.Names}}')
strapi_postgres_exists=$(docker ps -a --filter "name=strapi-postgres" --format '{{.Names}}')

# Run strapi-postgres container if it doesn't exist or is not running
if [ -z "$strapi_postgres_exists" ]; then
    docker run -d --name strapi-postgres -p 5432:5432 -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD postgres:14.7
    echo "strapi-postgres container created and started."
else
    container_status=$(docker inspect -f '{{.State.Status}}' strapi-postgres)

    if [ "$container_status" != "running" ]; then
        docker start strapi-postgres
        echo "strapi-postgres container started."
    else
        echo "strapi-postgres container already exists and is running. Skipping creation."
    fi
fi
