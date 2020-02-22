const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database established successfully!');
});

todoRoutes.route('/').get((req, res)=> {
    Todo.find((err, todos) => {
        if(err){
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get((req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        res.json(todo);
    });
})

todoRoutes.route('/add').post((req, res) => {
    let todo = new Todo(req.body);

    todo.save()
        .then(todo => {
            res.status(200).json(req.body);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed.');
        });
});

todoRoutes.route('/update').put((req, res) => {
    if(req.body && req.body.todo_id) {
        Todo.findById(req.body.todo_id, (err, todo) => {
            if(!todo){
                res.status(404).send('data is not found');
            } else {
                todo.todo_description = req.body.todo_description;
                todo.todo_responsible = req.body.todo_responsible;
                todo.todo_priority = req.body.todo_priority;
                todo.todo_completed = req.body.todo_completed;
    
                todo.save()
                    .then(todo => {
                        res.json(todo);
                    })
                    .catch(err => {
                        res.status(400).send('update todo failed.');
                    });
            }
        });
    } else {
        return res.status(400).send('update todo failed.');
    }
});

todoRoutes.route('/delete/:id').delete((req, res) => {
    Todo.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(err => {
        res.status(400).send('update todo failed.');
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});

