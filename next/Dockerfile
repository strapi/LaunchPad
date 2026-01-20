FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install --legacy-peer-deps; \
    fi

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
