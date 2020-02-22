import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Todo = props => (
    <div className={props.todo.todo_priority === 'High' ? "bg-danger card text-white mb-3" : props.todo.todo_priority === 'Medium' ? "bg-warning card text-white mb-3" : "bg-info card text-white mb-3"} style={{ maxWidth: 500 }}>
        <div className={props.todo.todo_completed ? 'card-header completed' : 'card-header'}>
            <h3 className='float-left'>{props.todo.todo_description}</h3>
            <button type="button" className="btn btn-light float-right">
                <Link to={'/edit/' + props.todo._id}>Edit</Link>
            </button>
        </div>
        <div className="card-body">
            <p className={props.todo.todo_completed ? 'card-text completed' : 'card-text'}>Responsible: {props.todo.todo_responsible}</p>
            <p className={props.todo.todo_completed ? 'card-text completed' : 'card-text'}>Priority: {props.todo.todo_priority}</p>
        </div>
    </div>
)

export default class TodosList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            todos: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/')
            .then(response => {
                this.setState({
                    todos: response.data
                })
            })
            .catch(error => console.log(error));
    }

    todosList() {
        return this.state.todos.map((currentTodo, i) => { return <Todo todo={currentTodo} key={i}></Todo> })
    }

    render() {
        return (
            <div>
                {this.todosList()}
            </div>
        )
    }
}
