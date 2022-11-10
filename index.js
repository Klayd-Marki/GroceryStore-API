
require("dotenv").config()
const cors = require("cors")
const port = 8000
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs');
const swaggerDocument = require('./docs/swagger.json')
const mongoose = require("mongoose")
const People = require("./models/peopleModel")
const itemModel = require("./models/itemsModel")
const bodyParser = require("body-parser")
const express = require("express")
const { faker } = require("@faker-js/faker")
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
const app = express()



mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/peopleApiDb")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())

require("./routes/allRoutes")(app)




/*
app.get('/people',(req,res)=>{
    res.send(peoples)
})
*/

/* mySeedScript.js */

// require the necessary libraries

const MongoClient = require("mongodb").MongoClient;
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


app.get('/peoples', (req, res) => {
  //res.send(["Peeter Paan", "33"])

  if (!req.body.name || !req.body.age) {
    return res.status(400).send({ error: 'One or all params are missing' })
  }
  let people = {
    id: people.lenght + 1,
    name: req.body.name,
    age: req.body.age
  }
  peoples.push(people)

  res.status(201)
    .location(`${getBaseUrl(req)}/peoples/${peoples.lenght}`)
    .send(people)
})

app.delete('/peoples/:id',(req,res)=>{
  if (typeof peoples[req.params.is -1]==='undefined') {
    return res.status(404).send({error: "People not found"}) 
  }
  peoples.splice(req.params.id-1, 1)
  res.status(204).send({error: "No content"})
})


function getBaseUrl(req) {
  return req.connection && req.connection.encrypted
  ? 'https' :'http' + `://${req.headers.host}`
}

/*async function seedDBPeoples() {
  // Connection URL
  const uri = "mongodb://localhost:27017/peopleApiDb";

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const collection = client.db("peopleApiDb").collection("peoples");

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.


    //collection.drop();


    
    // make a bunch of time series data
    let timeSeriesData = [];

    for (let i = 0; i < 10; i++) {
      const firstName = faker.name.firstName();
      const age = faker.datatype.number({'min': 18,'max': 50});
      let peoples = {
        name: firstName,
        age
        
      }
      timeSeriesData.push(peoples)
    }

    
    collection.insertMany(timeSeriesData, (err, result) => {
      if (err) {
      }
      else {
        console.log("Database seeded! :)");
        console.log(result);
      }
    });

    setTimeout(() => {
      client.close();
    }, 1500);


  } catch (err) {
    console.log("SEED error:", err);
  }
}

//seedDBPeoples();*/



  async function seedDBItems() {
  // Connection URL
  const uri = "mongodb://localhost:27017/peopleApiDb";

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const collection = client.db("peopleApiDb").collection("items");

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.


    //collection.drop();


    
    // make a bunch of time series data
    let timeSeriesData = [];

    for (let i = 0; i < 10; i++) {
      const name = faker.commerce.product();
      const price = faker.commerce.price(1, 10)
      let items = {
        name: name,
        price
        
      }
      timeSeriesData.push(items)
    }

    
    collection.insertMany(timeSeriesData, (err, result) => {
      if (err) {
      }
      else {
        console.log("Database seeded! :)");
        console.log(result);
      }
    });

    setTimeout(() => {
      client.close();
    }, 1500);


  } catch (err) {
    console.log("SEED error:", err);
  }
}

//seedDBItems();


/*// make seeding data
app.get('/seed', (req, res) => {
  const item = [
      {name: 'Banana',category:"Fruit", price: 2.99},
      {name: 'Apple',category:"Fruit", price: 1.79},
      {name: 'Carrot',category:"Vegetable", price: 5.36},
      {name: 'Potato',category:"Vegetable", price: 1.11}
  ];

  itemModel.insertMany(item, (err, docs) => {
      if(err){
          res.status(400).send(err);
      } else{
          res.status(201).send(docs);
      }
  });
});*/


app.post("/login", async (req, res, next) => {
   
  let { role, email, password } = req.body;
  
  let existingUser;
  
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
     return res.status(400).json((err))
  }
  

  if (!existingUser || !await bcrypt.compare(req.body.password,existingUser.password)) {
    const error = Error("Wrong details please check at once");
    return res.status(400).json(next(error))
  }
  
  let token;
  
  try {
    //Creating jwt token
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, role: existingUser.role },
      JWT_SECRET,
      { expiresIn: "2 days" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  
  res.status(200)
  .json({
    success: true,
    data: {
      role: existingUser.role,
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    },
  });
  console.log(token);
});

// Handling post request
app.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch (err){
    res.status(401).json(next(err))
   
  }
  let token;

  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {   
      console.log(JWT_SECRET);
    const error = new Error("Error! Something went wrong."); 
    return next(error);
  }
  res.status(201).json({
    success: true,
    data: { userId: newUser.id, email: newUser.email, role: newUser.role, token: token },
  });
});



app.set('view engine', 'ejs');
app.use(express.static('css'))



app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.listen(port, () => {
  console.log(`API up at: http//localhost: ${port}`)
})
