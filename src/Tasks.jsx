import React, { useEffect, useState } from 'react';
import Timer from './Timer';

function Tasks() {

	const [tasks,setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");

	const addTask = (e) => {
		// e.preventDefault();

		const currentTime = new Date().toISOString(); // Konvertera till UTC
		
		fetch("https://hammerhead-app-dbxxw.ondigitalocean.app/tasks", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({taskName: newTask, isCompleted: false, startDate: currentTime})
		})
		.then(() => setNewTask(""))
		// .then(() => fetchTasks())
		.then(() => window.location.reload());		
	}

	const fetchTasks = () => {
		fetch("https://hammerhead-app-dbxxw.ondigitalocean.app/tasks")
		.then(res => res.json())
		.then(data => {
			console.log("Fetched tasks:", data);
			setTasks(data.filter(task => !task.isCompleted));
		});
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