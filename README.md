# Performance of API-Composition in the context of REST and gRPC

This repository contains the code for all the components of the architecture that I used to measure the performance of gRPC and REST as communication protocols in API composition.

The user service, restaurant service, reservation service as well as the review service are deployed
on AWS together with their own database. You can either run the code using the cloud services
or host everything locally yourself.

The gateways and the frontend in any case run on your local machine.

> NOTE: The frontend of this project has been developed and tested in the Chrome browser. 
> Some things might not work as in intended in other browsers.

## Prerequisits

To be able to run the project on your computer, make sure you have the following components installed and set up:
* [Docker](https://www.docker.com)
* [Docker Compose](https://docs.docker.com/compose)
* [Node.js](https://nodejs.org)

## Run with services deployed on AWS

As this configuration has mainly been used during the performance analysis, setting up the project
to communicate with the cloud services in the default case. You only have to spin up the gateways and the
frontend, which you can do with `docker-compose up -d`. If you run this command for the first time, docker will build the images before actually running them, so this might take a while.

The frontend should now be running on http://localhost:3000/.

Also use docker-compose to shut down the containers: `docker-compose down`.

The gateways are preconfigured to communicate with the services deployed on AWS and
require no further configuration to work.

## Run everything on your local machine

To run the services and their databases locally together with the gateways and frontend,
make sure to pass the `-f` option to docker-compose to specify the name of the alternative
configuration file to run the containers:

```bash
docker-compose -f docker-compose.local.yml up -d
```

For a clean shutdown of the containers you also have to pass the `-f` flag to docker-compose with
`docker-compose -f docker-compose.local.yml down`.
As `docker-compose down` is a destructive command, so it will remove all containers and volumes. 
If you want to persist the data among multiple container runs, you should use 
`docker-compose -f docker-compose.local.yml stop`.

### Generate fake data

When running the experiment locally, the databases will be empty and require data.

You can use the generator tool located in `/generator` to generate any amount of fake data to test your queries.
On the command line, navigate to the folder with `cd generator` and install all required dependencies with `npm install`.
After that, use `npm run build` to build the generator project and `npm run start:local` to launch the script afterward.

You should then be asked to enter any amount of users and restaurants you want to create.
The generator will create fake users and restaurants and communicate with services to insert the data into their databases.

If the generator finds existing entries in a service's database, it will ask you if you want to override the data.

## Known issues

When you execute a very complex query that requires lots of requests many (~1000) times, it might happen that your machine runs out of open ports which causes the execution to "freeze". 

I'm not really sure if this is the exact reason and it shouldn't happen too often, but in case you experience problems where a run stops in the middle of the progress, it might be because of this.
