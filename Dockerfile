FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY dist ./dist
COPY node_modules/.prisma ./node_modules/.prisma
CMD ["node", "dist/main"]
