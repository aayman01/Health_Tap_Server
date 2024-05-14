const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewars
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrbh57q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const healthTapCollection = client.db("HealthTap").collection("services");
    const bookedServiceCollection = client
      .db("HealthTap")
      .collection("bookedService");
    const serviceProviderCollection = client
      .db("HealthTap")
      .collection("serviceProvider");

    // getting all the services
    app.get("/services", async (req, res) => {
      const cursor = healthTapCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting services by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await healthTapCollection.find(query).toArray();
      res.send(result);
    });

    // storing all booked service data in a new collection
    app.post("/bookedservice", async (req, res) => {
      const newData = req.body;
      const result = await bookedServiceCollection.insertOne(newData);
      res.send(result);
    });

    // storing all service provider data in a new collection
    app.post("/serviceProvider", async (req, res) => {
      const newData = req.body;
      const result = await serviceProviderCollection.insertOne(newData);
      res.send(result);
    });

    // getting all the service provider data
    // seacrhing specific data
    app.get("/allServiceProvider", async (req, res) => {
      const search = req.query.search;
      let query = {
        serviceName: { $regex: search, $options: "i" },
      };

      const result = await serviceProviderCollection.find(query).toArray();
      res.send(result);
    });

    // getting service provider data by id

    app.get("/allServiceProvider/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceProviderCollection.find(query).toArray();
      res.send(result);
    });

    // getting specific provider data by email
    app.get("/data/:email", async (req, res) => {
      const email = req.params.email;
      const query = { serviceProviderEmail: email };
      const result = await serviceProviderCollection.find(query).toArray();
      res.send(result);
    });

    // delecting specific data
    app.delete("/myService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceProviderCollection.deleteOne(query);
      res.send(result);
    });

    // updating data
    app.put("/service/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsart: true };
      const updatedData = {
        $set: {
          serviceImage: data.serviceImage,
          serviceName: data.serviceName,
          servicePrice: data.servicePrice,
          serviceLocation: data.serviceLocation,
          description: data.description,
          serviceProviderImage: data.serviceProviderImage,
          serviceProviderName: data.serviceProviderName,
          serviceProviderEmail: data.serviceProviderEmail,
        },
      };
      const result = await serviceProviderCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    // getting all booked services
    app.get("/bookedService", async (req, res) => {
      const cursor = bookedServiceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting all booked serive data by email
    app.get("/bookedService/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await bookedServiceCollection.find(query).toArray();
      res.send(result);
    });

    // updating single data
    app.patch('/updateservice/:id',async(req, res) => {
      const id = req.params.id;
      const status = req.body;
      const query = {_id : new ObjectId(id)};
      const updatedDoc = {
        $set: {
          serviceStatus : status.value
        },
      };
      const result = await bookedServiceCollection.updateOne(query, updatedDoc)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Health tap server is running...");
});

app.listen(port, () => {
  console.log(`My port is running on ${port}`);
});
