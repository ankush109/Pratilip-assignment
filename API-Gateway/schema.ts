import { gql } from "apollo-server";

const typeDefs = gql`

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
`;

export default typeDefs;
