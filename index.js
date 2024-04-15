import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { config } from "dotenv";

config({ path: process.ENV })

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:`${process.env.DATABASE}`,
  password:`${process.env.PASSWORD}`,
  port:`${process.env.PORT}`
})

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let items = [];

app.get("/", async (req, res) => {
  try{
    const result = await db.query("SELECT * from items ORDER BY id ASC");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: item });
  try{
   await db.query("INSERT INTO items (title) VALUES ($1)",[item])
   res.redirect("/");
  }catch(err){
    console.log(err);
  }
  
});
app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
