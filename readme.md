# REPO DETAILS :

1. STARTUP GUIDE :

## Docker

1. Clone the repository:

```bash
git clone https://github.com/ankush109/Pratilip-assignment.git
```

2. Build and Run the docker ( please retry if fails once but will work I test it thoroughly) :

```bash
docker compose up --build
```

3. Please note some routes are protected so Kindly login it gives accesstoken
   put the access token as Bearer Token else the requst will fail ( for some routes )

# DETAILS ABOUT EACH SERVICES :

![](https://github.com/ankush109/Pratilipi/blob/main/images/Microservices.png?raw=true)

## USER SERVICE :

1.  The USER SERVICE is responsible for handling User Registrations , Login ,Profile

2.  Authenication Service is present here it generates and validates accessTokens

3.  Produces events like "USER REGISTERED" & "PROFILE UPDATED" which is listened by ORDER SERVICE to make any changes in the Order which is made by an user
    eg : I made an order and now changed your address so the order service will listen to the change and update its order with your updated details
    For PUB-SUB I have used RABBIT_MQ

## PRODUCT SERVICE :

1.  The PRODUCT SERVICE is responsible for :
    a. Creating a new Product ,
    b. Getting a particular product ,
    c. Updating a product ,
    d. Deleting a product ,
    e. Getting all the products ,

2.  This Service listens for events like "ORDER PLACED" to update its inventory of the order made
    for eg : I ordered a macbook pro my stock would go down by the number order

## ORDER SERVICE :

1. The ORDER SERVICE is for

   1. Making an order it takes (UserId and Items which will contain each productId and its quantity)

   2. Gets the User address , phone number By calling a API CALL to USER SERVICE
      to fetch the user address , phone number , city and creates the order

   3. Listens for events "PROFILE UPDATE" to update the order details (user's phone number , address )

## GRAPHQL API GATEWAY :

Authentication :

    The request coming to the gateway should contain the bearer token which the gateway
    sends to the User service which validates the token only after that it can interact with other services
    Note: Creating a order &  get all users   is protected route

1.  This API GATEWAY is used to consolidate all the data from diff microservices( USER / PRODUCT / ORDER )
    and return reponse to the Client without the Client directly dealing with different services

2.  Used Redis as a caching layer to cache some queries (List all products )

3.  Invalidate the cache once a new product is created to avoid stale date to the Client

## PUB SUB (RABBIT MQ)

1.  Primary used for each service to talk to another service and trigger some events
2.  Producer publishes some event into the queue and the consumer has subscribed to the events consumes those

## Monitoring Services ( Prometheus & Graphana )

![](https://github.com/ankush109/Pratilipi/blob/main/images/graphana.png?raw=true)
