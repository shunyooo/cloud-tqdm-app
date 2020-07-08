FROM node:13.12.0-alpine
RUN apk --update --no-cache add gcc make g++ zlib-dev autoconf automake \
    libc6-compat libjpeg-turbo-dev libpng-dev nasm libtool
WORKDIR /app
