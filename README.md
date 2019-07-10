# Performance of API-Composition in the context of GraphQL

This repository contains the code for all services, gateways and the frontend which were used to
analyse the performance of API composition in the context of GraphQL.

The user service, restaurant service, reservation service as well as the review service are deployed
on AWS together with their own database. Thus, you can either run the code using the cloud services
or host everything locally yourself.

The gateways and frontend in any case remain on your local machine.

NOTE: This project has been developed and tested on a machine running macOS. I'm not quite sure if everything works fine
on other operating system.

## Prerequisits

docker, docker-compose, node

## Run with services deployed on AWS

As this configuration has mainly been used during the performance analysis, setting up the project
to communicate with the services in the default case. You only have to spin up the gateways and the
frontend, which you can do with `docker-compose up -d`.

You can also use docker-compose to shut down the containers with `docker-compose down`.

The gateways are preconfigured to communicate with the services deployed on AWS and
require no further configuration to work.

### Generate fake data

You can use the generator tool located in `/generator` to generate any amount of fake data to test your queries.
On the command line, navigate to the folder with `cd generator` and install all required dependencies with `npm install`.
After that, use `npm run build` to build the generator project and `npm start` to launch the script afterward.

You should then be asked to enter any amount of users and restaurants you want to create.
The generator will create fake users and restaurants and communicate with services to insert the data into their databases.

If the generator find existing entries in a service's database, it will ask you if you want to override the data.

## Run everything on your local machine

To also run the services and their databases locally together with the gateways and frontend,
make sure to pass the `-f` option to docker-compose to specify the name of the alternative
configuration file to run the containers:

```bash
docker-compose -f docker-compose.local.yml up -d
```

For a clean shutdown of the containers you also have to pass the `-f` flag to docker-compose with
`docker-compose -f docker-compose.local.yml down`.
As `docker-compose down` is a destructive command, it will remove all containers and volumes after
termination. If you want to persist the data and volumes that are used by the databases among multiple lifecycles of your containers, you should use `docker-compose -f docker-compose.local.yml stop`.

### Generate fake data

If you run everything on your local machine the generator requires the exact same steps to install dependencies and build the project. After this, you then have to run `npm run start:local` to tell the generator to communicate with the services
and are deployed locally on your machine.
