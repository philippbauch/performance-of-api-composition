# Performance of API-Composition in the context of GraphQL

This repository contains the code for all services, gateways and the frontend which were used to
analyse the performance of API composition in the context of GraphQL.

The user service, restaurant service, reservation service as well as the review service are deployed
on AWS together with their own database. Thus, you can either run the code using the cloud services
or host everything locally yourself.

The gateways and frontend in any case remain on your local machine.

## Run with services deployed to AWS

As this configuration has mainly been used during the performance analysis, setting up the project
to communicate with the services in the default case. You only have to spin up the gateways and the
frontend, which you can do with `docker-compose up -d`.

You can also use docker-compose to shut down the containers with `docker-compose down`.

The gateways are preconfigured to communicate with the services deployed on AWS and
require no further configuration to work.

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
