const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster3.xb4kix2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const verifyToken = async (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("spread_knowledge");
    const usersCollections = db.collection("users");
    const articleCollections = db.collection("articles");
    const commentsCollections = db.collection("comments");
    app.post("/user", async (req, res) => {
      const userData = req.body;
      const result = await usersCollections.insertOne(userData);
      res.send(result);
    });

    //article related api
    app.post("/articles", async (req, res) => {
      const articles = req.body;
      articles.likes = 0;
      const result = await articleCollections.insertOne(articles);
      res.send(result);
    });
    app.get("/articles", async (req, res) => {
      const result = await articleCollections.find().toArray();
      res.send(result);
    });

    app.get("/articles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await articleCollections.findOne(query);
      res.send(result);
    });
    app.patch("/articles/:id", async (req, res) => {
      const id = req.params.id;
      const { likes } = req.body;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          likes,
        },
      };
      const result = await articleCollections.updateOne(query, updatedDoc);
      res.send(result);
    });
    app.post("/comments", async (req, res) => {
      const comments = req.body;
      const result = await commentsCollections.insertOne(comments);
      res.send(result);
    });
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { articleId: id };
      const result = await commentsCollections.find(query).toArray();
      res.send(result);
    });

    // my articles api
    app.get("/myarticles", verifyToken,async (req, res) => {
      const email = req.query.email;

      const query = { authorEmail: email };
      const result = await articleCollections.find(query).toArray();
      res.send(result);
    });
    app.put("/updatearticles/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedPost = req.body;
      const updatedDoc = {
        $set: updatedPost,
      };
      const result = await articleCollections.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.delete("/myarticles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await articleCollections.deleteOne(query);
      res.send(result);
    });

    app.get("/category/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const result = await articleCollections.find(query).toArray();
      res.send(result);
    });
    app.get("/editorchoice", async (req, res) => {
      const result = await articleCollections.find().limit(3).toArray();
      res.send(result);
    });
    app.get("/topcontributors", async (req, res) => {
      const result = await articleCollections
        .aggregate([
          {
            $group: {
              _id: "$authorEmail",
              authorName: { $first: "$authorName" },
              totalArticle: { $sum: 1 },
            },
          },
          {
            $sort: { totalArticle: -1 },
          },
          {
            $limit: 5,
          },
        ])
        .toArray();

      res.send(result);
    });
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });
      res.send({ token });
    });

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
  res.send("Server is Running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
