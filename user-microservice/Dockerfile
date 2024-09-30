FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=5000
ENV DATABASE_URL="postgresql://postgres:root@host.docker.internal:5432/pusers?schema=public"
RUN npx prisma migrate dev
EXPOSE 5000
CMD ["npm", "run", "dev"]
