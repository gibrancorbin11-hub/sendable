# Builds the Sendable MCP server. It starts and answers tools/list with no
# key set (introspection), and only needs SENDABLE_API_KEY to actually send.
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENTRYPOINT ["node", "dist/index.js"]
