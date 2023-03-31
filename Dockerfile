FROM cypress/included:cypress-12.9.0-node-18.14.1-chrome-111.0.5563.146-1-ff-111.0.1-edge-111.0.1661.54-1

WORKDIR /app

ADD package.json ./
ADD yarn.lock ./
RUN yarn install

COPY . .

ENTRYPOINT [ "cypress" ]
CMD [ "run", "--config", "video=false" ]
