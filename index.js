const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://knowledge-spread.netlify.app"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});
const port = 3000;

//middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://knowledge-spread.netlify.app"],
  credentials: true
}));


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
const verifyEmail = (req, res, next) => {
  const requestedEmail = req.query.email || req.body.email;

  if (!requestedEmail) {
    return res.status(400).send({ message: "Email is required" });
  }

  if (req.decoded?.email !== requestedEmail) {
    return res.status(403).send({ message: "Forbidden: Email mismatch" });
  }

  next();
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const db = client.db("spread_knowledge");
    const usersCollections = db.collection("users");
    const articleCollections = db.collection("articles");
    const commentsCollections = db.collection("comments");
    const messagesCollections = db.collection("messages");
    const conversationsCollections = db.collection("conversations");

    
    app.post("/user", async (req, res) => {
      const userData = req.body;
      // Check if user already exists
      const existingUser = await usersCollections.findOne({ email: userData.email });
      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: existingUser._id });
      }
      const result = await usersCollections.insertOne(userData);
      res.send(result);
    });

    // Get user by email
    app.get("/user/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        const user = await usersCollections.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
      } catch (error) {
        res.status(500).send({ message: "Error fetching user", error: error.message });
      }
    });

    // Update user profile
    app.put("/user/:email", verifyToken, verifyEmail, async (req, res) => {
      try {
        const email = req.params.email;
        const updateData = req.body;
        const filter = { email };
        const updatedDoc = {
          $set: {
            userName: updateData.userName,
            photoURL: updateData.photoURL,
            bio: updateData.bio || "",
            updatedAt: new Date()
          }
        };
        const result = await usersCollections.updateOne(filter, updatedDoc);
        
        // Update photo and name in all messages sent by this user
        await messagesCollections.updateMany(
          { sender: email },
          {
            $set: {
              senderName: updateData.userName,
              senderPhoto: updateData.photoURL
            }
          }
        );
        
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error updating user", error: error.message });
      }
    });

    //article related api
    app.post("/articles",verifyToken, async (req, res) => {
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
      const filter = { _id: new ObjectId(id) };
      const result = await articleCollections.findOne(filter);
      res.send(result);
    });
    app.patch("/articles/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const { likes } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          likes,
        },
      };
      const result = await articleCollections.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.post("/comments",verifyToken, async (req, res) => {
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
    app.get("/myarticles",verifyToken,verifyEmail, async (req, res) => {
      const email = req.query.email;

      const query = { authorEmail: email };
      const result = await articleCollections.find(query).toArray();
      res.send(result);
    });
    app.put("/updatearticles/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedPost = req.body;
      const updatedDoc = {
        $set: updatedPost
      };
      const result = await articleCollections.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.delete("/myarticles/:id",verifyToken, async (req, res) => {
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
      const {email} = req.body;
      const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: "2h" });
      res.send({ token });
    });

    // Analytics API
    app.get("/analytics/:email", verifyToken, verifyEmail, async (req, res) => {
      try {
        const email = req.params.email;
        
        // Get total articles
        const totalArticles = await articleCollections.countDocuments({ authorEmail: email });
        
        // Get all user articles
        const articlesWithLikes = await articleCollections.find({ authorEmail: email }).toArray();
        
        // Get total likes
        const totalLikes = articlesWithLikes.reduce((sum, article) => sum + (article.likes || 0), 0);
        
        // Get total comments on user's articles - Fix the query
        const userArticleIds = articlesWithLikes.map(article => article._id.toString());
        let totalComments = 0;
        
        if (userArticleIds.length > 0) {
          // Query comments where articleId matches any of the user's article IDs
          const allComments = await commentsCollections.find({}).toArray();
          totalComments = allComments.filter(comment => userArticleIds.includes(comment.articleId)).length;
        }
        
        // Get articles by category
        const articlesByCategory = await articleCollections.aggregate([
          { $match: { authorEmail: email } },
          { $group: { _id: "$category", count: { $sum: 1 } } }
        ]).toArray();
        
        // Get recent articles
        const recentArticles = await articleCollections
          .find({ authorEmail: email })
          .sort({ _id: -1 })
          .limit(5)
          .toArray();

        res.send({
          totalArticles,
          totalLikes,
          totalComments,
          articlesByCategory,
          recentArticles
        });
      } catch (error) {
        res.status(500).send({ message: "Error fetching analytics", error: error.message });
      }
    });

    // Chat API endpoints
    app.get("/users", verifyToken, async (req, res) => {
      try {
        const currentUserEmail = req.decoded.email;
        const users = await usersCollections
          .find({ email: { $ne: currentUserEmail } })
          .project({ email: 1, userName: 1, displayName: 1, photoURL: 1 })
          .toArray();
        // Map userName to displayName for consistency
        const mappedUsers = users.map(user => ({
          ...user,
          displayName: user.displayName || user.userName || 'Anonymous'
        }));
        res.send(mappedUsers);
      } catch (error) {
        res.status(500).send({ message: "Error fetching users", error: error.message });
      }
    });

    app.get("/conversations", verifyToken, async (req, res) => {
      try {
        const email = req.decoded.email;
        const conversations = await conversationsCollections
          .find({ participants: email })
          .sort({ lastMessageTime: -1 })
          .toArray();
        res.send(conversations);
      } catch (error) {
        res.status(500).send({ message: "Error fetching conversations", error: error.message });
      }
    });

    app.get("/messages/:conversationId", verifyToken, async (req, res) => {
      try {
        const { conversationId } = req.params;
        const messages = await messagesCollections
          .find({ conversationId })
          .sort({ timestamp: 1 })
          .toArray();
        res.send(messages);
      } catch (error) {
        res.status(500).send({ message: "Error fetching messages", error: error.message });
      }
    });

    app.post("/conversations", verifyToken, async (req, res) => {
      try {
        const { participants } = req.body;
        
        // Check if conversation already exists
        const existingConversation = await conversationsCollections.findOne({
          participants: { $all: participants }
        });

        if (existingConversation) {
          return res.send(existingConversation);
        }

        const newConversation = {
          participants,
          lastMessage: "",
          lastMessageTime: new Date(),
          createdAt: new Date()
        };

        const result = await conversationsCollections.insertOne(newConversation);
        res.send({ ...newConversation, _id: result.insertedId });
      } catch (error) {
        res.status(500).send({ message: "Error creating conversation", error: error.message });
      }
    });

    // Socket.IO connection handling
    const connectedUsers = new Map();

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("user_connected", (userEmail) => {
        connectedUsers.set(userEmail, socket.id);
        io.emit("online_users", Array.from(connectedUsers.keys()));
      });

      socket.on("send_message", async (data) => {
        try {
          const { conversationId, sender, receiver, message, senderName, senderPhoto } = data;
          
          const newMessage = {
            conversationId,
            sender,
            receiver,
            message,
            senderName,
            senderPhoto,
            timestamp: new Date(),
            read: false
          };

          await messagesCollections.insertOne(newMessage);
          
          // Update conversation
          await conversationsCollections.updateOne(
            { _id: new ObjectId(conversationId) },
            {
              $set: {
                lastMessage: message,
                lastMessageTime: new Date()
              }
            }
          );

          // Emit to receiver if online
          const receiverSocketId = connectedUsers.get(receiver);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", newMessage);
          }

          // Emit back to sender for confirmation
          socket.emit("message_sent", newMessage);
        } catch (error) {
          socket.emit("message_error", { error: error.message });
        }
      });

      socket.on("typing", (data) => {
        const { receiver, sender } = data;
        const receiverSocketId = connectedUsers.get(receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("user_typing", { sender });
        }
      });

      socket.on("stop_typing", (data) => {
        const { receiver, sender } = data;
        const receiverSocketId = connectedUsers.get(receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("user_stop_typing", { sender });
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove user from connected users
        for (const [email, socketId] of connectedUsers.entries()) {
          if (socketId === socket.id) {
            connectedUsers.delete(email);
            io.emit("online_users", Array.from(connectedUsers.keys()));
            break;
          }
        }
      });
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

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
