# Manabu Server
This repo is for Manabu's REST API backend. For client-side code, refer to the [Manabu Client repo](https://github.com/edshen17/manabu-client.git).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

* [VSCode](https://code.visualstudio.com/download) + extensions ([ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))
* [Node.js (latest)](https://nodejs.org/en/download/)
* [MongoDb](https://www.mongodb.com/try/download/community)
* [Redis](https://redis.io/download) + [RedisInsight](https://redis.com/redis-enterprise/redis-insight/)

### Installation
1. `git clone https://github.com/edshen17/manabu-server.git --branch ts-refactor --single-branch --config core.autocrlf=false`
2. `npm install`
3. Create a .env file in the root directory to add secret API keys. Please ask the project manager for them.

When running tests, avoid closing them mid-way thru ctrl + c because stops cleanup. If you stop it, and use windows, check your /users/temp files and make sure to empty them