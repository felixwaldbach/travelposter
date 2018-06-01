FROM nginx:alpine

RUN apk update && \
  apk add nodejs && \
  apk add openrc

ENV NODE_ENV=PRODUCTION

ADD package.json /usr/app/package.json
RUN cd /usr/app && \
  npm install --production

ADD bin /usr/app/bin
ADD public /usr/app/public
ADD routes /usr/app/routes
ADD storage /usr/app/storage
ADD views /usr/app/views
ADD app.js /usr/app
ADD database.js /usr/app
ADD travelposter.sh /usr/app

RUN chmod 777 /usr/app/storage/

ADD deployment /

RUN npm install -g forever

CMD ["sh", "/usr/app/travelposter.sh"]

