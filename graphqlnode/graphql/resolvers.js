// // const Product = require('../models/product');
// import Product from '../models/product.js';

// export const resolvers  = {
//   /**
//    * CREATE PRODUCT - 
//    * @param { name, description, price, discount} ProductInput
//    * @returns Product
//    * 
//    * @mutation 
//    * mutation {
//       createProduct(productInput: { name: "Test Product 1",description: "Test Product",price: 7000.50,discount: 10}){
//           _id,
//           name,
//           description,
//           price,
//           discount,
//           created_at,
//           updated_at
//       }
//      }
//    */
//   createProduct: async function ({ productInput }) {
//     const product = new Product({
//       name: productInput.name,
//       description: productInput.description,
//       price: productInput.price,
//       discount: productInput.discount,
//     });
//     const createdProduct = await product.save();
//     return {
//       ...createdProduct._doc,
//       _id: createdProduct._id.toString(),
//     };
//   },

//   /**
//    * READ: QUERY PRODUCT - 
//    * @returns Product 
//    * { name, description, price, discount, created_at, updated_at}
//    * @query
//    * 
//      {
//       products{products{_id, description, price, discount,created_at,updated_at}}
//      }
//    */
//   products: async function () {
//     const products = await Product.find();
//     return {
//       products: products.map((q) => {
//         return {
//           ...q._doc,
//           _id: q._id.toString(),
//         };
//       })
//     };
//   },

//   /**
//    * UPDATE PRODUCT - 
//    * @param {id}, { name, description, price, discount} ID,ProductInput
//    * @returns Product
//    * 
//    * @mutation 
//    * mutation {
//       updateProduct(id:"605497bce3ad5c614f21c292",productInput: { name: "Test Product 2",description: "Test Product",price: 7500.50,discount: 8}){
//           _id,
//           name,
//           description,
//           price,
//           discount,
//           created_at,
//           updated_at
//       }
//       }
//    */
//   updateProduct: async function ({ id, productInput }) {
//     const product = await Product.findById(id);
//     if (!product) {
//       throw new Error('Product Not found!');
//     }
//     product.name = productInput.name;
//     product.description = productInput.description;
//     product.price = productInput.price;
//     product.discount = productInput.discount;

//     const updatedProduct = await product.save();
//     return {
//       ...updatedProduct._doc,
//       _id: updatedProduct._id.toString(),
//     };
//   },

//   /**
//    * DELETE PRODUCT - 
//    * @param {id} ID
//    * @returns Product
//    * 
//    * @mutation 
//    * mutation {
//       deleteProduct(id:"605497bce3ad5c614f21c292"){
//           _id,
//           name,
//           description,
//           price,
//           discount,
//           created_at,
//           updated_at
//       }
//      }
//    */
//   deleteProduct: async function ({ id, productInput }) {
//     const product = await Product.findById(id);
//     if (!product) {
//       throw new Error('Product Not found!');
//     }
//     // await Product.findByIdAndDelete(id);
//     await Product.findByIdAndDelete(id);
//     return {
//       ...product._doc,
//       _id: product._id.toString(),
//     };
//   },

//   Subscription: {
//     productAdded: {
//       subscribe: () => pubsub.asyncIterator(['PRODUCT_ADDED']),
//     },
//     productUpdated: {
//       subscribe: () => pubsub.asyncIterator(['PRODUCT_UPDATED']),
//     },
//     productDeleted: {
//       subscribe: () => pubsub.asyncIterator(['PRODUCT_DELETED']),
//     },
//   },
// };

import { PubSub } from 'graphql-subscriptions';
import Product from '../models/product.js';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    products: async () => {
      const products = await Product.find();
      return {
        products: products.map((q) => ({
          ...q._doc,
          _id: q._id.toString(),
        })),
      };
    },
  },
  Mutation: {
    createProduct: async (_, { productInput }) => {
      const product = new Product({
        name: productInput.name,
        description: productInput.description,
        price: productInput.price,
        discount: productInput.discount,
      });
      const createdProduct = await product.save();
      pubsub.publish('PRODUCT_ADDED', { productAdded: createdProduct });
      return {
        ...createdProduct._doc,
        _id: createdProduct._id.toString(),
      };
    },
    updateProduct: async (_, { id, productInput }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product Not found!');
      }
      product.name = productInput.name;
      product.description = productInput.description;
      product.price = productInput.price;
      product.discount = productInput.discount;

      const updatedProduct = await product.save();
      pubsub.publish('PRODUCT_UPDATED', { productUpdated: updatedProduct });
      return {
        ...updatedProduct._doc,
        _id: updatedProduct._id.toString(),
      };
    },
    deleteProduct: async (_, { id }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product Not found!');
      }
      await Product.findByIdAndDelete(id);
      pubsub.publish('PRODUCT_DELETED', { productDeleted: product });
      return {
        ...product._doc,
        _id: product._id.toString(),
      };
    },
  },
  Subscription: {
    productAdded: {
      subscribe: () => pubsub.asyncIterator(['PRODUCT_ADDED']),
    },
    productUpdated: {
      subscribe: () => pubsub.asyncIterator(['PRODUCT_UPDATED']),
    },
    productDeleted: {
      subscribe: () => pubsub.asyncIterator(['PRODUCT_DELETED']),
    },
  },
};
