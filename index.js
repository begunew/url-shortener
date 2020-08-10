const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const monk = require("monk");
const { nanoid } = require("nanoid");
const cors = require("cors");

require("dotenv").config();
const app = express();

const db = monk(process.env.MONGO_URI);
db.then(() => {
  console.log("Connected to MongoDB database.");
});
const urls = db.get("urls");
urls.createIndex({ slug: 1 }, { unique: true });

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("./public"));

app.get("/url/:id", (req, res) => {
  //TODO: get a short URL by ID
});

app.get("/:id", async (req, res, next) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${slug}-not-found`);
  } catch (error) {
    res.redirect(`/?error=Link-Not-Found`);
  }
});

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.post("/url", async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    await schema.validate({
      slug,
      url,
    });
    if (!slug) {
      slug = nanoid(5);
    } else {
      const existing = await urls.findOne({ slug });
      if (existing) {
        throw new Error("Slug in use");
      }
    }
    slug = slug.toLowerCase();
    const newUrl = {
      url,
      slug,
    };
    const created = await urls.insert(newUrl);
    res.json(created);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "yup" : error.stack,
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
