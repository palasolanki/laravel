#!/bin/bash

docker-compose up -d

# project run commnad
 cp .env.example .env

 docker-compose exec php composer install

 docker-compose exec php php artisan key:generate

 docker-compose exec php php artisan config:cache

 docker-compose exec php export NODE_OPTIONS=--openssl-legacy-provider

docker-compose exec php yarn install

docker-compose exec php php artisan db:seed --class=UserSeeder
