# EyeVocab
## p1 - Creator Interface
### `src/server`

This is the root of all server-side code. `NextJS` is inspired by Angular by implementing `controllers`, `services`, and `modules`.

#### Application Code
* `src/server/db` - database interactions, majority of code
* `src/server/view` - a *stable(?) way of rendering `ReactJS`/`NestJS` through underlyling `ExpressJS` server

#### Key files
* `main.ts` - bootstraps the application and defines the client port number (3000 for default)
* `app.controller.ts`
* `app.module.ts`
* `app.service.ts`

