// pages/api/graphql.js
import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql-tools'
import mongoose from 'mongoose'

import Orders from '../../model/Orders'

require('dotenv').config()


const typeDefs = gql`
type Order {
  id: ID!,
  customer: [Customer]!
  orderItems: [OrderItems]!
  restaurant: [Restaurant]!
  courier: [Courier]!
  orderType: String!
  reference: Int!
  status: String!
}

type Customer {
    id: ID!
    name: String!
    fullAddress: String!
    latitude: Int!
    longitude: Int!
    phoneNumber: Int!
  }

type OrderItems {
  name: String!  
  price: Int!
}

type Restaurant {
  fullAddress: String!
  logoImg: String!
  latitude: Int!
  longitude: Int!
  name: String!
} 

type Courier {
  name: String
  latitude: Int!
  longitude: Int!
}

input AddOrderInput {
  orderType: String! 
  reference: Int!
  status: String!
} 

type Query {
  getAllOrders: [Order]!
  getOrder(orderId: ID!): Order!
}

type Mutation {
  addOrder(addOrderInput: AddOrderInput, ): Order!
  addCustomer(orderId: ID!, name: String!, fullAddress: String!, latitude: Int!, longitude: Int!, phoneNumber: Int!):Order!
  addOrderItem(orderId: ID!, name: String!, price: Int!):Order!
  addRestaurant(orderId: ID!, fullAddress: String!, logoImg: String!, latitude: Int!, longitude: Int!, name: String!):Order!
  addOrderCourier(orderId: ID!, name: String!, latitude: Int!, longitude: Int!):Order!
}
`

const resolvers = {
  Query: {
    getAllOrders: async () => {
      try {
        const res = await Orders.find()
        return res
      } catch (err) {
        throw new Error(err)
      }
    },
    async getOrder(_, { orderId }, context, info) {
      const res = await Orders.findById(orderId)
      return res
    }
  },

  Mutation: {
    async addOrder(_, { addOrderInput: { courier, orderType, status, reference } }, context, info) {
      const newOrder = new Orders({
        courier,
        orderType,
        status,
        reference,
      })
      const res = await newOrder.save()
      return res
    },
    async addCustomer(_, { orderId, name, fullAddress, latitude, longitude, phoneNumber }, context, info) {
      const res = await Orders.findById(orderId)

      try {
        if (res) {
          res.customer.unshift({
            name,
            fullAddress,
            latitude,
            longitude,
            phoneNumber
          })
          await res.save()
          return res
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    async addOrderItem(_, { orderId, name, price }, context, info) {
      const res = await Orders.findById(orderId)
      try {
        if (res) {
          res.orderItems.unshift({
            name,
            price,
            // idOrder: orderId.toString()
          })
        }
        await res.save()
        return res
      } catch (err) {
        throw new Error(err)
      }
    },
    async addRestaurant(_, { orderId, fullAddress, logoImg, latitude, longitude, name }, context, info) {
      const res = await Orders.findById(orderId)
      try {
        if (res) {
          res.restaurant.unshift({
            fullAddress,
            logoImg,
            latitude,
            longitude,
            name
          })
        }
        await res.save()
        return res
      } catch (err) {
        throw new Error(err)
      }
    },
    async addOrderCourier(_, { orderId, name, latitude, longitude }, context, info) {
      const res = await Orders.findById(orderId)
      try {
        if (res) {
          res.courier.unshift({
            name,
            latitude,
            longitude
          })
        }
        await res.save()
        return res
      } catch (error) {
        throw new Error(err)
      }
    }
  }
}

// const pubsub = new PubSub();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const apolloServer = new ApolloServer({
  schema,
  // context: ({ req }) => ({ req, pubsub })
})

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
  })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })