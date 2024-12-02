FROM cypress/included:cypress-13.16.0-node-22.11.0-chrome-131.0.6778.85-1-ff-132.0.2-edge-131.0.2903.70-1

WORKDIR /app

ADD package.json ./
ADD yarn.lock ./
RUN yarn install

COPY . .

ENTRYPOINT [ "cypress" ]
CMD [ "run", "--config", "video=false" ]
