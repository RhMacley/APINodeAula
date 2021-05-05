const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  const { title }= req.query;

  const resultSearch = title ? repositories.filter(repositorie=> repositorie.title.includes(title)) : repositories;

  return res.json(resultSearch)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)
  console.log(repository)
  return res.json(repository)
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params
  const { title, url, techs } = req.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0) res.status(400).json({ error:"Repository not found" })
  const repository = {
    id, 
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }
  repositories[repositoryIndex] = repository

  return res.json(repository)
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0) res.status(400).json({ error:"Repository not found" })
  repositories.splice(repositoryIndex, 1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0) res.status(400).json({ error:"Repository not found" })

  repositories[repositoryIndex].likes ++
  return res.json(repositories[repositoryIndex])
});

module.exports = app;
