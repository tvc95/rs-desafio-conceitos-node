const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;                 // Corpo da requisição
  const newRepo = { id: v4(), title, url, techs, likes: 0 };  // Criação de um novo repositório

  repositories.push(newRepo);                               // Colocar o repositório na lista
  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  //Procurar o indice do repositório buscado na lista
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  //Caso o repositório não exista
  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  //Caso contrário, atualize os valores do repositório encontrado
  const updatedRepo = { ...repositories[repoIndex], title: title, url: url, techs: techs };
  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  //Caso o repositório não exista
  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //Procurar o indice do repositório buscado na lista
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  //Caso o repositório não exista
  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  //Caso contrário, atualize os valores do repositório encontrado
  const updatedRepo = { ...repositories[repoIndex], likes: repositories[repoIndex].likes + 1 };
  repositories[repoIndex] = updatedRepo;

  return response.json({
    id: id,
    likes: updatedRepo.likes
  });
});

module.exports = app;
