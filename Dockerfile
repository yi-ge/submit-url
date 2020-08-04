FROM node:12.18.3-alpine
LABEL AUTHOR="yi-ge"
LABEL maintainer="a@wyr.me"

RUN apk add --no-cache \
  bash \
  ca-certificates \
  git

RUN mkdir /project

ADD . /project

WORKDIR /project

EXPOSE 80

CMD ["npm", "start"]