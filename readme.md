# MICRO-SERVICES BACKEND PROJECT 


## Docker

1. Clone the repository:

```bash
git clone https://github.com/ankush109/Pratilipi.git
```

2. Build and Run the docker ( please retry if fails once but will work I test it thoroughly) :

```bash
docker compose up --build
```

Note: Please make sure ports 5000 , 6000 , 7000 are available or it might cause an error while running the containers 
 Please make sure all the services are running else run the command again : 
 
 ![](https://github.com/ankush109/Pratilipi/blob/main/images/show.png?raw=true) 
 
3. Please note some routes are protected so Kindly login it gives accesstoken
   put the access token as Bearer Token else the requst will fail ( for some routes )

STEP 1. REGISTER A NEW USEER
STEP 2. LOGIN AND GET THE ACCESS TOKEN 
STEP 3. MAKE A FEW  PRODUCTS
STEP 4. PLACING AND ORDER : - ( 2 things are required here ) 
        i)  userId ( get it from the register reponse or get all users route )
       ii)  product_id and the quantity , 
       PS:)    please check the postman collection overall the flow will be like this I have provided everything in the postman collection itself 

# DETAILS ABOUT EACH MICRO-SERVICES :

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

3.  Invalidate the cache once a new product is created to avoid stale data to the Client

## PUB SUB (RABBIT MQ)

1.  Primary used for each service to talk to another service and trigger some events
2.  Producer publishes some event into the queue and the consumer has subscribed to the events consumes 


## Redis (Act as a  Caching layer in the Api-Gateway ) 

1.  Primary used to cache data (like the list of products frequently queried by the client to make them faster )


## Monitoring Services ( Prometheus & Graphana )

![](https://github.com/ankush109/Pratilipi/blob/main/images/graphana.png?raw=true)

# What can be do to Scale this system well I have some ideas 

![](https://raw.githubusercontent.com/ankush109/Pratilipi/refs/heads/main/images/advance-architecure.png)


1. The main entry point of the client request will hit the gateway which can first authenticate the request by sending the request to a AUTH SERVICE
2. The gateway on getting a request checks the Service Discovery to located the load balancer of the service need to be hit
3. The load balancer further balances the number of requests based on some algorithm like Round Robbin , etc
4. Can be made in Auto scaling groups with Kubernates ( Not aware of that part )  but would likely scale the pods of a particular service on getting high
   number of requests to ensure availability of the systems .



