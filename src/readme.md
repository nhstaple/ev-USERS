# EyeVocab
## p1 - Creator Interface
### `src/`

The is the root directory for the source of p1.

* [`src/api`](./api/readme.md) - application programming interface for shared logic between the frontend and the backend: database entities, database client, etc.
* [`src/client`](./client/readme.md) - all code for the frontend (ReactJS / NextJS)
* [`src/server`](./server/) - all code for the backend (ExpressJS / NestJS)

### NodeJS package requirements

[Link to package.json](../package.json)

* TypeScript
* @types/{next, next-server, react, react-dom, rethinkdb}
* next 12.1.5
* @nestjs/{common, @nestjs/core, @nestjs/platform-express}
* axios 0.27.2
* nest-next 10.0.0
* next-server 9.0.5
* react 18.1.0
* react-router-dom 6.3.0
* simple-keyboard 3.4.107
* react-simple-keyboard 3.4.141
* rethinkdb 2.4.2

### Additional requirements

RethinkDB - [install directions](https://rethinkdb.com/docs/install/)

**Note**: if you are using a macOS machine then you need to install [Homebrew](https://brew.sh/).