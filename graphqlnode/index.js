// import express from 'express';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import { graphqlHTTP } from 'express-graphql';
// import dotenv from 'dotenv';
// import graphqlSchema from './graphql/schema.js';
// import { resolvers as graphqlResolver } from './graphql/resolvers.js';

// dotenv.config();

// const port = 3000;

// // # EXPRESS::INITIALIZE APP -/
// const app = express();

// // # ADD MIDDLEWARE -/
// app.use(bodyParser.json());
// app.use(cors());

// // # GRAPHQL::API SERVICE -/
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: graphqlSchema,
//     rootValue: graphqlResolver,
//     graphiql: true,
//   })
// );


//   mongoose
//   .connect('mongodb://localhost:27017/mydatabase')
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Connected to Port ${port}.`);
//     });
//   })
//   .catch((err) => console.log(err));

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws'; 
import typeDefs from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());

// GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create HTTP server
const httpServer = createServer(app);

// Apollo Server setup
async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
  });

  await server.start();

  // Apply Apollo Server middleware
  server.applyMiddleware({ app });

  // Log server details
  console.log('Apollo Server started:', server);

  // Install subscription handlers
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: server.graphqlPath, // GraphQL endpoint path
      subscriptionsPath: server.subscriptionsPath, // WebSocket subscriptions path
    }
  );

  // Start HTTP server after MongoDB connection
  mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}${server.graphqlPath}`);
      console.log(`Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
}

startApolloServer();

