FROM cypress/included:cypress-13.6.1-node-20.9.0-chrome-118.0.5993.88-1-ff-118.0.2-edge-118.0.2088.46-1

WORKDIR /app

ADD package.json ./
ADD yarn.lock ./
RUN yarn install

COPY . .

ENTRYPOINT [ "cypress" ]
CMD [ "run", "--config", "video=false" ]
