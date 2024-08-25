import React, { useEffect, useState } from 'react';

function Statistics() {
    const [tasks, setTasks] = useState([]);
	const [sortOption, setSortOption] = useState('taskName'); // default sorteringsalternativ

    useEffect(() => {
        fetch("https://hammerhead-app-dbxxw.ondigitalocean.app/tasks")
        .then(res => res.json())
        .then(data => setTasks(data.filter(task => task.isCompleted)));
    }, []);

    const sortTasks = (tasks, option) => {
        switch (option) {
            case 'taskName':
                return [...tasks].sort((a, b) => a.taskName.localeCompare(b.taskName));
            case 'trackedTime':
                return [...tasks].sort((a, b) => convertToSeconds(b.trackedTime) - convertToSeconds(a.trackedTime));
            case 'startDate':
                return [...tasks].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
			case 'last7Days':
				return filterLast7Days(tasks).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

            default:
                return tasks;
        }
    };

	const filterLast7Days = (tasks) => {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		return tasks.filter(task => new Date(task.startDate) >= sevenDaysAgo);
	};

	const convertToSeconds = (timeString) => {
        if (!timeString) return 0;
        const timeParts = timeString.split(" ");
        let totalSeconds = 0;
        timeParts.forEach(part => {
            const unit = part.slice(-1);
            const value = parseInt(part.slice(0, -1), 10);
            if (!isNaN(value)) {
                if (unit === 'm') totalSeconds += value * 60;
                if (unit === 's') totalSeconds += value;
            }
        });
        return totalSeconds;
    };

	const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
	};

    const handleDelete = (taskId) => {
        fetch(`https://hammerhead-app-dbxxw.ondigitalocean.app/tasks/${taskId}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (res.ok) {
                setTasks(tasks.filter(task => task.id !== taskId));
            } else {
                console.error('Failed to delete task');
            }
        });
    };

	const sortedTasks = sortTasks(tasks, sortOption);

    return (
        <>
            <div>
                <div>
                  <h1>Statistics</h1>  
                </div>
                <div>
                    <label htmlFor="sort">Sort by: </label>
                    <select id="sort" value={sortOption} onChange={handleSortChange}>
                        <option value="taskName">Task Name</option>
                        <option value="trackedTime">Tracked Time</option>
                        <option value="startDate">Start Date</option>
                        <option value="last7Days">Last 7 Days</option>
                    </select>

                    {sortedTasks.map((task) => (
                        <div id='statsDiv' key={task.id}>
                            <div>{task.taskName}</div><br />
                            <div>TrackedTime: {task.trackedTime}</div>
                            <div>StartDate: {formatDate(task.startDate)}</div>
                            <br />
                            <button onClick={() => handleDelete(task.id)}>Delete</button>
                            <br />
                        
                        </div>
                        
                    ))}
                </div>
            </div>
        </>
	);
}

export default Statistics;
