require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Article = require("./models/Article");
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db is connected successfully"))
  .catch((err) => console.log("error is : " + err));

app.use(express.json());
app.get("/hellow", (req, res) => {
  res.send("hellow mohamed");
});
app.get("/hi", (req, res) => {
  res.send("hiiiiiiiiiiiiiiiiii");
});

app.get("/findSummation/:number1/:number2", (req, res) => {
  const num1 = Number(req.params.number1);
  const num2 = Number(req.params.number2);
  const total = num1 + num2;
  res.send(`the number is: ${total} `);
});

app.get("/sayHallow", (req, res) => {
  res.send(`hallow ${req.body.name} , your age is ${req.query.age}`);
});

app.get("/numbers", (req, res) => {
  let numbers = "";
  for (let i = 0; i <= 100; i++) {
    numbers += i + "-";
  }
  res.send(`numbers are : ${numbers}`);
});
app.get("/getbackendbypath", (req, res) => {
  res.render("getbackendbypath.ejs", {
    name: "mohamed",
  });
});
//article endpoint
//add
app.post("/article", async (req, res) => {
  const newArticle = await Article.create(req.body);
  res.json(newArticle);
});
//edit
app.put("/article/:id", async (req, res) => {
  const newArticle = await Article.findByIdAndUpdate(req.params.id, req.body);
  res.json(newArticle);
});
//delete
app.delete("/article/:id", async (req, res) => {
  const newArticle = await Article.findByIdAndDelete(req.params.id);
  res.json(newArticle);
});
//get
app.get("/article", async (req, res) => {
  try {
    // 1- جلب الـ query params
    const { search, page = 1, limit = 10 } = req.query;

    // 2- ابني query ديناميكي
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } }
      ];
    }

    // 3- Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 4- جلب البيانات
    const articles = await Article.find(query)
      .skip(skip)
      .limit(parseInt(limit));
 
    // 5- العدد الكلي للـ frontend
    const total = await Article.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      articles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
