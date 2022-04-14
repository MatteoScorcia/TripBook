FROM node:16-alpine as builder
WORKDIR /monolith/
COPY ./ ./
RUN npm install
RUN npm run build

FROM node:16-alpine
WORKDIR /api/
COPY --from=builder /monolith/src/api/package.json ./
COPY --from=builder /monolith/src/dto/ node_modules/@aindo/dto
RUN npm install --only=production
COPY --from=builder /monolith/src/api/dist dist
COPY --from=builder /monolith/src/app/build static
COPY --from=builder /monolith/NUTS.json NUTS.json
ENV NODE_ENV="production"
ENV MONGODB_URI="mongodb://admin:password@localhost:27017/"
ENV SECRET_KEY="my_super_secret_key"
ENV MIGRATE="true"
ENV PORT=4100
EXPOSE ${PORT}
CMD node /api/dist/migrationNUTS.js /api/NUTS.json && node /api/dist/index.js

#remove all containers stopped
#docker rm $(docker ps --filter status=exited -q)

#remove all images <none>
#docker rmi $(docker images --filter "dangling=true" -q --no-trunc)

#sudo docker build -t node:koa-api ./
#sudo docker run -it --init --rm -p 8888:4100 --name test node:koa-api
