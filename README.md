# Manabu Server
This repo is for Manabu's REST API backend. For client-side code, refer to the [Manabu Client repo](https://github.com/edshen17/manabu-client.git). If you are full-stack, you will have to create a client folder in the root directory when cloning the Manabu Client repo.

## Getting Started

These instructions will help you get a copy of the project up and running for development and testing purposes. 

### Prerequisites

* [VSCode](https://code.visualstudio.com/download) + extensions ([ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))
* [Node.js (latest)](https://nodejs.org/en/download/)
* [MongoDb](https://www.mongodb.com/try/download/community)
* [Redis](https://redis.io/download) + [RedisInsight](https://redis.com/redis-enterprise/redis-insight/)

### Installation
1. `git clone https://github.com/edshen17/manabu-server.git --branch ts-refactor --single-branch --config core.autocrlf=false`
2. `npm install`
3. Create a .env file in the root directory to add secret API keys. Please ask the project manager for them

### Tests
To run the test suite, run `npm t`.

### Starting the server
To start the backend server, type `npm run server`. Please refer to `package.json` for additional commands.

NOTE: 
When running tests, avoid stopping them mid-way through commands like CTRL + C because it stops data cleanup. When this happens (and you use Windows), a data dump will be created in your `\Users\~\AppData\Local\Temp` folder so make sure to occasionally check and clear it. Also, the tests are quite CPU intensive and may cause lag spikes since they run concurrently.

### Project Structure
This project revolves heavily around the concepts of dependency injection and the single-responsibility principle. Please refer to [this diagram](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg).

As you can see, entities, or core business logic, is at the very center of the circle. Thus, even if we change the frameworks or technology we use, our logic will not change. This enables us to easily change our code as our stack evolves. Furthermore, by using dependency injection, we can quickly prototype but and also throw away code that is no longer needed (eg. when business rules/strategy change). For more information on this clean architecture, refer to [this video](https://www.youtube.com/watch?v=fy6-LSE_zjI).

### Code Quality
We should strive to write code that is as clean as possible. However, first implementations are often not the best or cleanest, so refactoring is crucial. This is why we use the TDD paradigm, meaning we **must** write tests first before doing anything else. This not only helps document our code, but also makes it easy to modify.

### Deployment
To deploy on Heroku, follow the following steps:
1. Run `npm build` on the client code (cd to client folder)
2. Run `npm build` for the server code
3. Push the code and merge the development branch with the `master` branch.
