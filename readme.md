# Micro-Services Backend Project

## Docker Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/ankush109/Pratilipi.git
    ```

2. Build and run the Docker containers (retry if it fails once; the setup has been tested thoroughly):

    ```bash
    docker compose up --build
    ```

    **Note:** Ensure that ports `5000`, `6000`, and `7000` are available. If not, it might cause an error while running the containers.

3. Check if all services are running. If not, rerun the above command.

    ![Services Running](https://github.com/ankush109/Pratilipi/blob/main/images/show.png?raw=true)

4. Some routes are protected. You need to **login** to get an access token.  
   Use the access token as a Bearer Token in the request headers; otherwise, the request will fail for those protected routes.

---


```graphql
 type User {
    id: ID!
    name: String!
    email: String!
  }

  
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    description: String!
  }

 
  type Order {
    id: ID!
    userId: ID!
    items: [OrderItem!]! 
    total: Float!
    status: String!
    shippingAddress: String!
    pincode: String!
    city: String!
    country: String!
    phoneNumber: String!
  }


  type OrderItem {
    id: ID!                
    productId: ID!
    quantity: Int!
    price: Float!
  }

  # Queries for fetching data
  type Query {
   
    users: [User!]!

    
    user(id: ID!): User

    products: [Product!]!

   
    product(id: ID!): Product

   
    orders: [Order!]!

    
    order(id: ID!): Order
  }

 
  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    price: Float!
    description: String!
    stock: Int!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input OrderInput {
    userId: ID!
    items: [OrderItemInput!]!

  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  type AuthTokens {
    accessToken: String!
    refreshToken: String!
  }

  # Mutations for creating or updating data
  type Mutation {
   
    registerUser(input: RegisterInput!): User!

   
    createProduct(input: ProductInput!): Product!

    
    loginUser(input: LoginInput!): AuthTokens!

    placeOrder(input: OrderInput!): Order!
  }



```
# Sample queries

```graphql
# get all users : (give accesstoken in Authorization headers )
query GetUsers{
  users {
     email
     id
     name 
  } 
}

# get all products

query getProducts{
  products {
    id
    stock
    price
    name
    description
  } 
}

# get all the orders 
query GetOrders{
  orders {
    id
    items {
      price
      quantity
      productId
    } 
  }
}

# get product By Id 
query getProducts {
  product(id: "cm1qya1580000bh9wwyn2rnnf") {
    id
    stock
    price
    name
    description
  }
}





# Making a order (authenticated provided access token you got from login response ) 
mutation PlaceOrder {
  placeOrder(input: {
   userId:"cm1q1lerp000012aiouc66hx3" # replace with a user ID 
    items: [
      {
        productId: "cm1q5946u0000p58yli8l75qd",  # replace with a product Id
        quantity: 2
      },
      
    ]
  }) {
    id
     
   items {
    price
    quantity
   }
    
  }
}

# Regiser

mutation RegisterUser {
  registerUser(
    input: {
      name: "John Doe",
      email: "jon.doe@example.com",
      password: "securepassword"
    }
  ) {
    id
    name
    email
  }
}

# Login
mutation LoginUser {
  loginUser(input: { 
    email: "jon.doe@example.com", 
    password: "securepassword" 
  }) {
    accessToken
    refreshToken
  }
}

# Create a new product : 
mutation CreateProduct {
  createProduct(
    input: {
      name: "Sample Product",
      price: 29.99,
      stock: 50,
      description: "This is a description for a sample product."
    }
  ) {
    id
    name
    price
    stock
    description
  }
}



```
## Basic Flow Overview:

- **Step 1:** Register a new user.
- **Step 2:** Login and get the access token.
- **Step 3:** Create a few products.
- **Step 4:** Place an order by providing:
    - **userId** (get this from the register response or from the `get all users` route).
    - **product_id** and the **quantity**.
  
  The complete flow and details are provided in the **Postman collection**.

---

# Microservices Breakdown

![Microservices Architecture](https://github.com/ankush109/Pratilipi/blob/main/images/Microservices.png?raw=true)

## User Service

1. Handles **User Registration**, **Login**, and **Profile** management.
2. Manages **authentication** by generating and validating access tokens.
3. Produces events like `"USER REGISTERED"` and `"PROFILE UPDATED"`, which the **Order Service** listens to for updating order details when user information changes.
   
    - Example: If a user changes their address, the **Order Service** updates the order with the new address.
    - **RabbitMQ** is used for Pub-Sub communication.

## Product Service

1. Responsible for:
    - Creating a new product.
    - Retrieving product details.
    - Updating and deleting products.
    - Fetching all products.
  
2. Listens for `"ORDER PLACED"` events to update the product inventory.
   
    - Example: If an order is placed for a product (e.g., MacBook Pro), the stock decreases by the quantity ordered.

## Order Service

1. Manages orders by taking in **userId** and **items** (productId and quantity).
2. Fetches user details (address, phone number, etc.) from the **User Service** through API calls.
3. Listens for `"PROFILE UPDATED"` events to update existing order details (address, phone number, etc.).

## GraphQL API Gateway

1. Centralized API gateway that handles requests for data from different microservices (User, Product, and Order services).
2. Performs authentication by validating the access token with the **User Service**.
   
    - **Protected Routes:** Placing an order and getting all users require a valid access token.

3. Caches frequent queries (e.g., list of products) using **Redis** for faster response times.
4. Automatically invalidates cached data when new products are added to prevent stale data.

---

## Pub-Sub with RabbitMQ

1. **Pub-Sub Architecture** enables services to communicate via events.
2. A service (producer) publishes events to a queue, and the consumer (subscriber) processes those events.

---

## Redis Caching

1. **Redis** is used as a caching layer within the API Gateway.
2. Primarily caches frequently queried data (e.g., product lists) to improve performance.
3. Automatically invalidates caches when new products are created or updated.

---

## Monitoring with Prometheus & Grafana

![Grafana Monitoring](https://github.com/ankush109/Pratilipi/blob/main/images/graphana.png?raw=true)

1. **Prometheus** is used for metrics collection.
2. **Grafana** is used to visualize the data collected from services to monitor the health and performance of the system.

---

# Scaling Ideas

![Advanced Architecture](https://raw.githubusercontent.com/ankush109/Pratilipi/refs/heads/main/images/advance-architecure.png)

1. The **API Gateway** serves as the entry point for client requests and authenticates them via an **Auth Service**.
2. The gateway checks the **Service Discovery** to locate the load balancer of the target service.
3. The **Load Balancer** distributes the requests across multiple instances of the service, using strategies like round-robin.
4. The system can be scaled using **Auto Scaling Groups** with **Kubernetes** (though not implemented yet).
   
    - **Auto Scaling** can increase or decrease the number of service instances (pods) based on incoming traffic to ensure high availability.
