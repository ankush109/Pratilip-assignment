import { gql } from "apollo-server";

const typeDefs = gql`
  # User type definition
  type User {
    id: ID!
    name: String!
    email: String!
  }

  # Product type definition
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    description: String!
  }

  # Order type definition
  type Order {
    id: ID!
    userId: ID!
    items: [OrderItem!]!  # Make sure this matches how you return the items in the resolver
    total: Float!
    status: String!
    shippingAddress: String!
    pincode: String!
    city: String!
    country: String!
    phoneNumber: String!
  }

  # OrderItem type definition (nested inside Order)
  type OrderItem {
    id: ID!                # Unique identifier for the order item
    productId: ID!
    quantity: Int!
    price: Float!
  }

  # Queries for fetching data
  type Query {
    # Fetch all users
    users: [User!]!

    # Fetch a single user by ID
    user(id: ID!): User

    # Fetch all products
    products: [Product!]!

    # Fetch a single product by ID
    product(id: ID!): Product

    # Fetch all orders
    orders: [Order!]!

    # Fetch a single order by ID
    order(id: ID!): Order
  }

  # Input types for mutations
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
    # Register a new user
    registerUser(input: RegisterInput!): User!

    # Create a new product (admin-only)
    createProduct(input: ProductInput!): Product!

    # User login
    loginUser(input: LoginInput!): AuthTokens!

    # Place a new order
    placeOrder(input: OrderInput!): Order!
  }
`;

export default typeDefs;
