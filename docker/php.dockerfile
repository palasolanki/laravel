FROM php:7.4-fpm

RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    libzip-dev \
    unzip \
    git \
    libonig-dev \
    curl

RUN docker-php-ext-install pdo pdo_mysql
RUN docker-php-ext-install mysqli gd
RUN docker-php-ext-install zip
RUN pecl install mongodb-1.7.4
RUN docker-php-ext-enable mongodb

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -

RUN apt-get install -y nodejs

RUN apt-get install -y libxrender1 libxext6

RUN apt-get install fontconfig -y

RUN npm install -g yarn