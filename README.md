# Performance of API-Composition in the context of GraphQL

## Run on your local machine

To run this project on your local machine, you have to have Docker Compose installed.

If Docker Compose is installed correctly, you can just run:

```bash
docker-compose up -d
```

## Data models

### User

```javascript
// TODO: Paste GraphQL model here
{
    _id: ObjectID,
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    favourites: Restaurant[]
}
```

### Restaurant

```javascript
// TODO: Paste GraphQL model here
{
    _id: ObjectID,
    name: String,
    address: {
        street: String,
        houseNumber: Number,
        city: String,
        zipCode: String
    },
    reviews: Review[]
}
```

### Review

```javascript
// TODO: Paste GraphQL model here
{
    _id: ObjectID,
    user: User,
    restaurant: Restaurant,
    rating: Number
    comment: String
}
```

### Reservation

```javascript
// TODO: Paste GraphQL model here
{
    _id: ObjectID,
    user: User
    restaurant: Restaurant,
    time: Date
    pax: Number
}
```
