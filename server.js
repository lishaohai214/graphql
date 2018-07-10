const express = require('express')
const expressGraphql = require('express-graphql')
const schema = require('./schema')
const app = express();


app.use('/graphql', expressGraphql(()=>({
    schema,
    graphiql: true,
    pretty: true 
})))

app.listen(4000, ()=>{
    console.log('server is running ...')
})