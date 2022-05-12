# ev-crud

> EyeVocab - Create, Retrieve, Update, Delete
> 
> _Program 1 - Creator Interface_

## Description

This is the **Creator Interface** for the beta phase of **EyeVocab**,  aimed to teach foriegn languages through **Modals**: typing, imagery recall, speech recognition, etc. This repo is to have a feasibly deployable web application (NestJS, NextJS, RethinkDB, and TypeScript.) 

_Program 1_ defines the **Creator Interface** allows **Creators** to create **Collections** that organize a series of **Vocabulary** cards. Planned for May 2022.

_Program 2_ defines the **Instructor Interface** that allows **Instructors** to organize groups of **Collections** into **Courses**. Planned for late May / early June 2022.

_Program 3_ defines the **Student Interface** which allows **Students** to enroll in an **Instructor's** **Course(s)** and freely practice through different **Modals**. The **Student Interface**  is planned for mobile platforms. Planned for Summer 2022.

_Program 4_ defines the **Spacing Algorithm** which allows **Instructor's** to fine-tune material delivery to students. Planned for 2022.

## Installation

This project uses RethinkDB. __Make sure__ this is installed, reachable by the host machine, and running before launching the node application.

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### For Docker

Make sure that you have Docker installed with support for Docker Compose. Usage of Docker is recommended for the deployed environment.

**TODO update client endpoints to read the HOST and PORT values from a configuration file!**

```bash
$ docker-compose -d up
```

## Test

```bash
# unit tests
$ npm run test
```

## Stay in touch

- Principal Investigators: Robert J. Blake, Nicole Ranganath
- Programmers: Nirvair Singh, Nick Stapleton
- Students: Alec, Shelby, Ronvic, Ankit, Ofek, Ryan

## License

The EyeVocab project is receives open-source funding through the University of California, Davis's Language Center.
