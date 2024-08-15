import React, { useEffect, useState } from 'react';
import Timer from './Timer';

//interface behövs inte i js
// interface Task {
// 	id: String,
// 	taskName: String
// }

function Tasks() {

	const [tasks,setTasks] = useState([]);

	const [newTask, setNewTask] = useState("");

	const addTask = (e) => {
		// e.preventDefault();
		
		fetch("http://localhost:8080/tasks", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({taskName: newTask})
		})
		.then(() => setNewTask(""))
		.then(() => fetchTasks()); // Hämta uppdaterade tasks		
	}

	const fetchTasks = () => {
        fetch("http://localhost:8080/tasks")
        .then(res => res.json())
        .then(data => setTasks(data));
    }

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<>
			<div>
				<h1>ActiveTasks</h1>

				<form onSubmit={addTask}>
					<input type="text" value={newTask} onChange={((e) => setNewTask(e.target.value))}></input>
					<button>Add Task</button>
				</form>
			</div>
			<div>
				{tasks.map((task) => (
					<div id='taskDiv' key={task.id}>
						<Timer key={task.id} task={task} />
					</div>

				))}
			</div>
		</>
	);
}

export default Tasks;