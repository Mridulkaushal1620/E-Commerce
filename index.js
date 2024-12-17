const connectToMongo = require('./db');
var cors = require('cors')

connectToMongo();

const express = require('express')
const app = express()
app.use(cors())

    
    
    
    const port = 4000
    app.use(express.json())
    //Avilable routes
    app.use('/api/auth',require("./routes/auth"))
    app.use('/api/products',require("./routes/products"))
    app.use('/api/order',require("./routes/order"))
    
    
    app.listen(port, () => {
      console.log(`iNotebook Backend listening on port http://localhost:${port}`)
    })