// // import { buildSchema } from 'graphql';

// // export default buildSchema(`
// //     type Product{
// //         _id:ID!
// //         name: String!
// //         description: String!
// //         price: Float!
// //         discount: Int
// //         created_at: String!
// //         updated_at: String!
// //     }    
// //     type ProductData {
// //         products: [Product!]!
// //     }
// //     input ProductInputData {
// //         name: String!
// //         description: String!
// //         price: Float!
// //         discount: Int
// //     }
// //     type RootQuery {
// //         products: ProductData!
// //     }
// //     type RootMutation {
// //         createProduct(productInput:ProductInputData): Product!
// //         updateProduct(id: ID!, productInput:ProductInputData): Product!
// //         deleteProduct(id: ID!): Product!
// //     }
// //     schema {
// //         query: RootQuery
// //         mutation: RootMutation
// //     }
// // `);

// import { gql } from 'apollo-server-express';

// const typeDefs = gql`
//   type Product {
//     _id: ID!
//     name: String!
//     description: String!
//     price: Float!
//     discount: Int
//     created_at: String!
//     updated_at: String!
//   }

//   type ProductData {
//     products: [Product!]!
//   }

//   input ProductInputData {
//     name: String!
//     description: String!
//     price: Float!
//     discount: Int
//   }

//   type RootQuery {
//     products: ProductData!
//   }

//   type RootMutation {
//     createProduct(productInput: ProductInputData): Product!
//     updateProduct(id: ID!, productInput: ProductInputData): Product!
//     deleteProduct(id: ID!): Product!
//   }

//   type Subscription {
//     productAdded: Product!
//     productUpdated: Product!
//     productDeleted: Product!
//   }

//   schema {
//     query: RootQuery
//     mutation: RootMutation
//     subscription: Subscription
//   }
// `;

// export default typeDefs;

import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    discount: Int
    created_at: String!
    updated_at: String!
  }

  type ProductData {
    products: [Product!]!
  }

  input ProductInputData {
    name: String!
    description: String!
    price: Float!
    discount: Int
  }

  type Query {
    products: ProductData!
  }

  type Mutation {
    createProduct(productInput: ProductInputData): Product!
    updateProduct(id: ID!, productInput: ProductInputData): Product!
    deleteProduct(id: ID!): Product!
  }

  type Subscription {
    productAdded: Product!
    productUpdated: Product!
    productDeleted: Product!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

export default typeDefs;

