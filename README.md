# Getting Started

## Get the Code

```
git clone https://bitbucket.org/joebri/napoleonic-client.git
cd napoleonic-client
npm install
```

## Running the application locally

### Pre-requisites

- Start the napoleonic-service (see [repo](https://github.com/joebri/napoleonic-service.git)).

### Run

- `npm run start:dev`

## Testing

- `npm test`

## Deploying to Docker

- Run `npm run build` to create production build (see \build folder).

- Run `npm run docker:up` to build and run the container.
