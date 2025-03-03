# 1. Build 단계
FROM node:20 AS build
WORKDIR /app

# 패키지 설치
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 소스 코드 복사 및 빌드 실행
COPY . .
RUN yarn build

# 2. Serve 단계
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]