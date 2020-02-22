import React, { Component } from 'react';
import axios from 'axios';

export default class EditTodo extends Component {
    constructor(props) {
        super(props)

        this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
        this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
        this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
        this.onChangeTodoCompleted = this.onChangeTodoCompleted.bind(this);
        this.onEditTodo = this.onEditTodo.bind(this);
        this.onDeleteTodo = this.onDeleteTodo.bind(this);
        this.onSubmitTodo = this.onSubmitTodo.bind(this);

        this.state = {
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false,
            todo_disabled: true,
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/todos/${this.props.match.params.id}`)
            .then(response => {
                this.setState({
                    todo_description: response.data.todo_description,
                    todo_responsible: response.data.todo_responsible,
                    todo_priority: response.data.todo_priority,
                    todo_completed: response.data.todo_completed
                })
            })
            .catch(error => {
                console.log(error)
            });
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.onEditTodo);
    }

    onChangeTodoDescription(e) {
        this.setState({
            todo_description: e.target.value
        });
    }

    onChangeTodoResponsible(e) {
        this.setState({
            todo_responsible: e.target.value
        });
    }

    onChangeTodoPriority(e) {
        this.setState({
            todo_priority: e.target.value
        });
    }

    onChangeTodoCompleted(e) {
        this.setState({
            todo_completed: !this.state.todo_completed
        });
    }

    onEditTodo(e) {
        e.preventDefault();
        this.setState({
            todo_disabled: !this.state.todo_disabled
        });
    }

    onDeleteTodo(e){
        e.preventDefault();
        const obj = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
            todo_completed: this.state.todo_completed
        };

        axios.delete(`http://localhost:4000/todos/delete/${this.props.match.params.id}`)
            .then(res => {
                this.setState({
                    todos: res.data
                });
                this.props.history.push('/');
            });
    }

    onSubmitTodo() {
        const obj = {
            todo_id: this.props.match.params.id,
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
            todo_completed: this.state.todo_completed
        };

        axios.put('http://localhost:4000/todos/update', obj)
            .then(res => {
                this.props.history.push('/');
            });
    }

    render() {
        return (
            <div className='form-container'>
                <h3>Update Todo</h3>
                <div className='form-group'>
                    <label>Description: </label>
                    <input type='text' className='form-control' value={this.state.todo_description} onChange={this.onChangeTodoDescription} disabled={this.state.todo_disabled} />
                </div>
                <div className='form-group'>
                    <label>Responsible: </label>
                    <input type='text' className='form-control' value={this.state.todo_responsible} onChange={this.onChangeTodoResponsible} disabled={this.state.todo_disabled} />
                </div>
                <div className='form-group'>
                    <label className='priority-label'>Priority: </label>
                    <div className='form-check form-check-inline'>
                        <input className='form-check-imput' type='radio' name='priorityOptions' id='priorityLow'
                            value='Low' checked={this.state.todo_priority === 'Low'} onChange={this.onChangeTodoPriority} disabled={this.state.todo_disabled} />
                        <label className='form-check-label'>&nbsp;Low</label>
                    </div>
                    <div className='form-check form-check-inline'>
                        <input className='form-check-imput' type='radio' name='priorityOptions' id='priorityMedium'
                            value='Medium' checked={this.state.todo_priority === 'Medium'} onChange={this.onChangeTodoPriority} disabled={this.state.todo_disabled} />
                        <label className='form-check-label'>&nbsp;Medium</label>
                    </div>
                    <div className='form-check form-check-inline'>
                        <input className='form-check-imput' type='radio' name='priorityOptions' id='priorityHigh'
                            value='High' checked={this.state.todo_priority === 'High'} onChange={this.onChangeTodoPriority} disabled={this.state.todo_disabled} />
                        <label className='form-check-label'>&nbsp;High</label>
                    </div>
                </div>
                <div className='form-check'>
                    <input type='checkbox' className='form-check-input' id='completedCheckbox' name='completedCheckbox'
                        onChange={this.onChangeTodoCompleted} checked={this.state.todo_completed} value={this.state.todo_completed} disabled={this.state.todo_disabled} />
                    <label className='form-check-label' htmlFor='completedCheckbox'>Completed</label>
                </div>
                <br />
                <div className='form-group'>
                    <input type='button' value='Edit Todo' className={this.state.todo_disabled ? "btn btn-primary mr-2 d-inline" : "d-none"} onClick={this.onEditTodo} />
                    <input type='button' value='Delete Todo' className={this.state.todo_disabled ? "btn btn-danger mr-2 d-inline" : "d-none"} onClick={this.onDeleteTodo} />
                    <input type='submit' value='Save Todo' className={this.state.todo_disabled ? "d-none" : "btn btn-success mr-2 d-inline"} onClick={this.onSubmitTodo} />
                </div>
            </div>
        )
    }
}
