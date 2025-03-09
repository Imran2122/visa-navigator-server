require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const req = require("express/lib/request");

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =
  "mongodb+srv://visa-01:RTn2QfQ4L3PnGaoM@cluster0.kvwi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client.connect().then(() => {


  const visaCollection = client.db("visaDB").collection("visa");
  const userCollection = client.db("visaDB").collection("users");
  const applicationCollection = client.db("visaDB").collection("applications");

  // GET all visas
  app.get("/add-visa", async (req, res) => {
    const visas = await visaCollection.find().toArray();
    res.send(visas);
  });

  // POST: Add a new visa
  app.post("/add-visa", async (req, res) => {
    const result = await visaCollection.insertOne(req.body);
    res.send(result);
  });

  app.get("/latest-visas", async (req, res) => {
    try {
      const latestVisas = await visaCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(latestVisas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest visas", error });
    }
  });

  //my add visa

  app.get("/my-applications/:email", async (req, res) => {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const applications = await visaCollection.find({ email }).toArray();
    res.json(applications);
  });

  app.delete("/add-visa/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await visaCollection.deleteOne(query);
    res.send(result);
  });

  //update

  // });
  app.get("/add-visa/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await visaCollection.findOne(query);
    res.send(result);
  });

  app.put("/add-visa/:id", async (req, res) => {
    const id = req.params.id;
    const updatedVisa = req.body;
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        countryImage: updatedVisa.countryImage,
        countryName: updatedVisa.countryName,
        visaType: updatedVisa.visaType,
        processingTime: updatedVisa.processingTime,
        requiredDocuments: updatedVisa.requiredDocuments,
        description: updatedVisa.description,
        ageRestriction: updatedVisa.ageRestriction,
        fee: updatedVisa.fee,
        validity: updatedVisa.validity,
        applicationMethod: updatedVisa.applicationMethod,
        addedBy: updatedVisa.addedBy,
      },
    };

    const result = await visaCollection.updateOne(query, updateDoc);
    res.send(result);
  });

  //

  // GET: Fetch visa details by ID
  app.get("/visa/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await visaCollection.findOne(query);
    res.send(result);
  });

  //user get info

  app.get("/users", async (req, res) => {
    const cursor = userCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  app.post("/users", async (req, res) => {
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser);
    res.send(result);
  });

  //ends

  // POST: Add a new user related
  app.post("/users", async (req, res) => {
    const result = await userCollection.insertOne(req.body);
    res.send(result);
  });



  //application start
  

  app.get("/my-applications/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const cursor = applicationCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
  });

  //post



  app.post('/my-applications',async(req,res)=>{
    const application=req.body;
    const result=await applicationCollection.insertOne(application)
    res.send(result)
  })


  // DELETE: Cancel an application

  app.delete("/my-applications/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await applicationCollection.deleteOne(query);
    res.send(result);
  });

  app.get("/", (req, res) => res.send(" Visa Navigator Server is running!"));
});

// Start server
app.listen(port, () => console.log(` Server running on port ${port}`));
