# LI.FI Fee Collector

![Build Status](https://github.com/marcus-gomes-v/li-fi-fee-collector/actions/workflows/ci.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/marcus-gomes-v/li-fi-fee-collector/badge.svg?branch=main)](https://coveralls.io/github/marcus-gomes-v/li-fi-fee-collector?branch=main)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/node-20.11.1-brightgreen)
![Last Commit](https://img.shields.io/github/last-commit/marcus-gomes-v/li-fi-fee-collector)
![GitHub issues](https://img.shields.io/github/issues/marcus-gomes-v/li-fi-fee-collector)


This project is a take-home assignment for the Senior Backend Engineer role at LI.FI. It involves building a tool to scrape emitted events from a smart contract, store them in a MongoDB database, and provide an API to retrieve the events. The project is structured using SOLID principles and various design patterns to ensure clean, maintainable, and scalable code.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Debugging with VS Code](#debugging-with-vs-code)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Continuous Integration](#continuous-integration)
- [Pagination](#pagination)
- [License](#license)

## Setup Instructions

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/) (v20.11.1)
- [npm](https://www.npmjs.com/get-npm)

### Environment Variables

Create a `.env` file in the root directory with the following content:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/li-fi
POLYGON_RPC=https://polygon-rpc.com
CONTRACT_ADDRESS=0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9
```

## Running the Application

### Using Docker Compose

To start the application using Docker Compose, run the following command:

```bash
docker-compose up --build
```

This command will build the Docker images and start the services defined in `docker-compose.yml`. The application will be accessible at `http://localhost:3000`.


## API Endpoints

### Fetch Events

**URL:** `/api/fees/fetch-events`  
**Method:** `POST`  
**Body:**

```json
{
  "fromBlock": <starting_block_number>,
  "toBlock": <ending_block_number>
}
```

**Response:**
- `200 OK` if events are fetched and stored successfully.
- `500 Internal Server Error` if there is an error.

**Example Curl Request:**

```bash
curl -X POST http://localhost:3000/api/fees/fetch-events \
  -H "Content-Type: application/json" \
  -d '{
    "fromBlock": 47961368,
    "toBlock": 47961370
  }'
```

### Get Events by Integrator

**URL:** `/api/fees/events/:integrator`  
**Method:** `GET`  
**Query Parameters:**
- `page`: (optional) The page number for pagination.
- `limit`: (optional) The number of items per page for pagination.

**Response:**

```json
[
  {
    "token": "0xTokenAddress",
    "integrator": "0xIntegratorAddress",
    "integratorFee": "1000000000000000000",
    "lifiFee": "100000000000000000"
  },
  ...
]
```

**Example Curl Request:**

```bash
curl http://localhost:3000/api/fees/events/0xIntegratorAddress?page=1&limit=10
```

## Running Tests

To run tests, use the following command:

```bash
npm test
```

This will execute the unit and integration tests defined in the project.

## Continuous Integration

The project includes a GitHub Actions workflow for Continuous Integration (CI). The workflow is defined in `.github/workflows/ci.yml` and performs the following tasks:

- Checks out the code.
- Sets up Node.js.
- Installs dependencies.
- Runs tests.

### Configuration

Ensure your `.github/workflows/ci.yml` is configured as follows:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20.11.1'

    - name: Install dependencies
      run: yarn install

    - name: Run ESLint
      run: yarn lint

    - name: Run tests and generate coverage
      run: yarn test -- --coverage

    - name: Upload coverage to Coveralls
      uses: coverallsapp/github-action@v2
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        path-to-lcov: coverage/lcov.info
```

## Pagination

The `GET /api/fees/events/:integrator` endpoint supports pagination via query parameters. You can specify the `page` and `limit` parameters to control the pagination of the results.

### Example Request

```bash
curl http://localhost:3000/api/fees/events/0xIntegratorAddress?page=2&limit=5
```

This request fetches the second page of results with 5 items per page.

## License

This project is licensed under the MIT License.