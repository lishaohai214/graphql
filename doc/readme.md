```s
$ npm init -y

$ npm i nodemon graphl express-graphql express --save 

```
server.js
```js
const express = require('express')
const expressGraphql = require('express-graphql')
const schema = require('./schema')
const app = express();


app.use('/graphql', expressGraphql(()=>({
    schema,
    graphiql: true,
    pretty: true 
})))

app.listen(3000, ()=>{
    console.log('server is running ...')
})
```
schema.js
```js
const {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
    
} = require('graphql')

// hardcode
const customers = [
    {id: '1', name: 'jack', email: 'jack@q163.com', age: 39},
    {id: '2', name: 'ben', email: 'ben@q163.com', age: 30},
    {id: '3', name: 'henriy', email: 'henriy@q163.com', age: 26},
    {id: '4', name: 'bucky', email: 'bucky@q163.com', age:19},
    {id: '5', name: 'kinmi', email: 'kinmi@q163.com', age: 24},
];

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
                for(let i = 0; i < customers.length; i ++ ){
                    if(customers[i].id == args.id){
                        return customers[i];
                    }
                }
                // return customers.find(({id})=>{
                //     return id == args.id;
                // })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType
})


```
打开浏览器  查询以下语句
```
query{
  customer(id: "3") {
    id
    name
    email
    age 
  }
}

```


```s
$ npm i json-server

$ ni db.json
```

db.json
```json
{
    "users": [{
        "id": "1",
        "name": "jack",
        "email": "jack@q163.com",
        "age": 39
    }, {
        "id": "2",
        "name": "ben",
        "email": "ben@q163.com",
        "age": 30
    }, {
        "id": "3",
        "name": "henriy",
        "email": "henriy@q163.com",
        "age": 26
    }, {
        "id": "4",
        "name": "bucky",
        "email": "bucky@q163.com",
        "age": 19
    }, {
        "id": "5",
        "name": "kinmi",
        "email": "kinmi@q163.com",
        "age": 24
    }]
}
```


```json
"scripts": {
    "json-server": "json-server --watch db.json"
},
```
```s
$ npm run json-server 
```

schema.js
```js
// hardcode
// const customers = [
//     {id: '1', name: 'jack', email: 'jack@q163.com', age: 39},
//     {id: '2', name: 'ben', email: 'ben@q163.com', age: 30},
//     {id: '3', name: 'henriy', email: 'henriy@q163.com', age: 26},
//     {id: '4', name: 'bucky', email: 'bucky@q163.com', age:19},
//     {id: '5', name: 'kinmi', email: 'kinmi@q163.com', age: 24},
// ];

```
```json
const axios = require('axios')
```
json-server 
```js
resolve(parenVal, args){
    // return customers.find(({id})=>{
    //     return id == args.id;
    // })
    return axios.get("http://localhost:3000/users/" + args.id).then(res=>res.data)
}
```


浏览器输入
```
query{
  customer(id: "3") {
    id
    name
    email
    age 
  }
}
```


以上是搜索一个用户

搜索多个用户
schema.js
```js
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parenVal, args){
                return axios.get("http://localhost:3000/users/").then(res=>res.data)
            }
        }
    }
})
```
```
query {
  customers{
    id
    name
    email
    age 
  }
}
```
对数据的增删改查
```js
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
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation
})

```
```
mutation{
  addCustomer(name:"imjack", email: "imjack@163.com", age:34){
    id
    name
    email
    age
  }
}
```

```
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
```
        
```
mutation{
  editCustomer(id: "4iw2g4s", name:"tom"){
    id
    name
    email
    age
  }
}
```

```
deleteCustomer:{
    type: CustomerType,
    args:{
        id: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve(parenVal, args){
        return axios.delete("http://localhost:3000/users/"+args.id).then(res=>res.data)
    }
}
```
```
mutation{
  deleteCustomer(id: "4iw2g4s"){
    id
    name
    email
    age
  }
}
```
```



