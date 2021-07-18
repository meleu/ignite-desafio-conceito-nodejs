const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return response.status(404).json({ message: `username not found: "${username}"`})
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (!name || !username) {
    return response.status(400).json({ message: '"name" and "username" must NOT be empty.'});
  }

  const newUser = {
    id: uuid(),
    name,
    username,
    todos: []
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});


app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});


app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuid(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});


app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const { todos: userTodos } = user;

  const todo = userTodos.find((t) => t.id === id);

  if (!todo) {
    return response.status(404).json({ message: 'task not found!' });
  }

  if (!!title) {
    todo.title = title;
  }
  if (!!deadline) {
    todo.deadline = deadline;
  }

  return response.status(200).json({ todo });
});


app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});


app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
