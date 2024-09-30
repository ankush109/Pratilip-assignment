import { gql } from "apollo-server";


// Define the GraphQL schema
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
  }

  # Order type definition
  type Order {
    id: ID!
    userId: ID!
    total: Float!
    status: String!
    items: [OrderItem!]!
  }

  # OrderItem type definition (nested inside Order)
  type OrderItem {
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
    stock: Int!
  }

  input OrderInput {
    userId: ID!
    items: [OrderItemInput!]!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  # Mutations for creating or updating data
  type Mutation {
    # Register a new user
    registerUser(input: RegisterInput!): User!

    # Create a new product (admin-only)
    createProduct(input: ProductInput!): Product!

    # Place a new order
    placeOrder(input: OrderInput!): Order!
  }
`;

export default typeDefs; 
