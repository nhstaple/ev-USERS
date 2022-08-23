# EyeVocab
## p1 - Creator Interface
### `src/api`

This is the root of the EyeVocab API for code that is shared between the client and the server.

* [`src/api/db`](./db) - database device for backend services
* [`src/api/entities`](./entities) - objects that are stored, retrieved, updated, etc. in the database service.
* [`src/api/keyboard`](./keyboard) - virtual keyboard layouts for all supported languages

**TODO**: all language and linguistic support needs to be refractored into it's own module. For now, this is found in [`vocab.interface.ts`](./entities/vocab/vocab.interface.ts).
