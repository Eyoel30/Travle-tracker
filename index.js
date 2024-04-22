import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
const app = express();
const port = 3000;

const db = new pg.Client({
  username: "postgres",
  host: "localhost",
  database: "world",
  password: "789456",
  port: 5432,
})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted() {
  const result = await db.query("SELECT countntry_conde FROM visited_countries")

  const countries = []

  result.rows.forEach(country => countries.push(country.country_code))
  return countries
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted()
  res.render("index.ejs", { countries: countries, total: countries.length })
})

app.post("/add", async (req, res) => {
  const input = req.body.country
  const result = await db.query("SELECT country_code FROM countries WHERE country_name =$1", [input])
  if (result.rows !== 0) {
    const data = result.rows[0]
    const country_code = data.country_code
    await db.query("INSERT INTO visited_countries (country_code) VALUE=$1", [country_code])
  }
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
