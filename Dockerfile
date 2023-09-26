FROM cypress/included:cypress-13.2.0-node-20.6.1-chrome-116.0.5845.187-1-ff-117.0-edge-116.0.1938.76-1

WORKDIR /app

ADD package.json ./
ADD yarn.lock ./
RUN yarn install

COPY . .

ENTRYPOINT [ "cypress" ]
CMD [ "run", "--config", "video=false" ]
