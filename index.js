require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbsgl0h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Global scope variable
let portfoliocollection;

async function run() {
  try {
    await client.connect();
    portfoliocollection = client.db('portfolio').collection('project');

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

const { ObjectId } = require('mongodb');
// GET project by ID
app.get('/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid project ID format" });
    }

    const project = await portfoliocollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    res.send(project);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch project" });
  }
});

// GET route to fetch all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await portfoliocollection.find().toArray();
    res.send(projects);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch projects" });
  }
});

app.get('/', (req, res) => {
  res.send('portfolio server is running');
});

app.listen(port, () => {
  console.log(`portfolio server on port ${port}`);
});
