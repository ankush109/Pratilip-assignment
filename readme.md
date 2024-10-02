# PRATILIPI ASSIGNMENT DETAILS :

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

1. DETAILS ABOUT EACH SERVICE :

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

            a. Making an order it takes (UserId and Items which will contain each productId and its quantity)

            b.Gets the User address , phone number By calling a API CALL to USER SERVICE
            to fetch the user address , phone number , city  and creates the order

            c.Listens for events "PROFILE UPDATE" to update the order details (user's phone number , address )
