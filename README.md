## Description
This configuration is a backend RESTful API boilerplate with the following pieces:

- Docker as the container service to isolate the environment.
- Node.js (Node 18) as the run-time environment to run TypeScript.
- NestJs as the server framework
- MongoDB as the database 

## How to run this application
You will need to first download and install Docker Desktop.
* Navigate to the root folder under the command line.
* Run docker-compose up to start 2 containers:
    - the MongoDB database container
    - the Node.js app container


## Test

Test coverage is 100 percent.

```bash
npm install
# unit and integration tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Application by default provide the below user:
**username/password: test-user/password**

The api can be accessed by rest api ***Post http://localhost:3000/api/v1/login*** with json body
```
{
    "username": "test-user",
    "password": "password"
}
```
A JWT token will be returned if username and password are correct.

A user has a maximum of 3 attempts within 5 minutes, otherwise, the user will be locked.
