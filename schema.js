const axios = require('axios')
const {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
    
} = require('graphql')
// hardcode
// const customers = [
//     {id: '1', name: 'jack', email: 'jack@q163.com', age: 39},
//     {id: '2', name: 'ben', email: 'ben@q163.com', age: 30},
//     {id: '3', name: 'henriy', email: 'henriy@q163.com', age: 26},
//     {id: '4', name: 'bucky', email: 'bucky@q163.com', age:19},
//     {id: '5', name: 'kinmi', email: 'kinmi@q163.com', age: 24},
// ];

const CustomerType = new GraphQLObjectType({
    name: "Customer",
    fields:()=>({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type:GraphQLInt}
    })
})


// root query 
const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parenVal, args){
                // return customers.find(({id})=>{
                //     return id == args.id;
                // })
                return axios.get("http://localhost:3000/users/" + args.id).then(res=>res.data)
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parenVal, args){
                return axios.get("http://localhost:3000/users/").then(res=>res.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCustomer:{
            type: CustomerType,
            args:{
                name: { type: GraphQLString},
                email: {type: GraphQLString},
                age:{type: GraphQLInt }
            },
            resolve(parenVal, args){
                return axios.post("http://localhost:3000/users/", {
                    name: args.name,
                    email: args.email,
                    age: args.age 
                }).then(res=>res.data)
            }
        },
        editCustomer:{
            type: CustomerType,
            args:{
                id: { type: GraphQLString},
                name: { type: GraphQLString},
                email: {type: GraphQLString},
                age:{type: GraphQLInt }
            },
            resolve(parenVal, args){
                return axios.patch("http://localhost:3000/users/" + args.id,args, {
                    name: args.name,
                    email: args.email,
                    age: args.age 
                }).then(res=>res.data)
            }
        },
        deleteCustomer:{
            type: CustomerType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parenVal, args){
                return axios.delete("http://localhost:3000/users/"+args.id).then(res=>res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation
})

