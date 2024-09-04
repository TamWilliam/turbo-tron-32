const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")

const app = express()
const port = 3000

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "turbotron32",
  password: "root",
  port: 5432,
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
