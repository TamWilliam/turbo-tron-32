const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")
require("dotenv").config()

const app = express()
const port = 3000

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

app.use(cors())

app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM data")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Erreur serveur")
  }
})

app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${port}`)
})
