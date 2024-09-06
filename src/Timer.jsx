import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Timer({ task }) {
    const [isActive, setIsActive] = useState(false); // är aktiv
    const [elapsedTime, setElapsedTime] = useState(0); // pågående tid i sekunder
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        // om starttime finns
        if (task.startTime) {
            const currentTime = Math.floor(Date.now() / 1000);
            const timeSinceStart = currentTime - task.startTime;
            setElapsedTime(timeSinceStart);
            setStartTime(task.startTime);
            setIsActive(true);
        }
    }, [task]);

    //uppdateringsintervall 1000ms om null cleara skiten
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isActive && elapsedTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, elapsedTime]);

    const startTimer = () => {
        // ./1000 för unix time i sekunder (anatalet sekunder som förflutit sedan 1:a januari 1970)
        const currentTime = Math.floor(Date.now() / 1000); 

        //ändrar null från starttime till currenttime som är date.now i sekunder(unix)
        setStartTime(currentTime); 

        //isActive boolean blir true
        setIsActive(true); 

        // Fetchar tasken och uppdaterar starttiden i databasen till currenttime (sätter en stämpel när den startas)
        fetch(`https://hammerhead-app-dbxxw.ondigitalocean.app/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                ...task,
                startTime: currentTime
            })
        });
    };

    const stopTimer = () => {
        //sätter currentTime bolean till false och stoppar 
        setIsActive(false);

        //sen lägger till det nya värdet från tidtagningen
        const updatedTrackedTime = task.trackedTime 
            ? convertToSeconds(task.trackedTime) + elapsedTime 
            : elapsedTime;

        // Spara uppdaterad total tid och nollställ pågående tid i databasen
        fetch(`https://hammerhead-app-dbxxw.ondigitalocean.app/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                ...task,
                trackedTime: convertToMinutes(updatedTrackedTime),
                startTime: null // Rensa starttiden när timern stoppas
            })
        });

        setElapsedTime(0); // Nollställ pågående tid

        //ladda om sidan för att visa total trackad tid
		window.location.reload();
    };

    const removeTask = () => {
       

        const updatedTrackedTime = task.trackedTime 
            ? convertToSeconds(task.trackedTime) + elapsedTime 
            : elapsedTime;

        fetch(`https://hammerhead-app-dbxxw.ondigitalocean.app/tasks/${task.id}/complete`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                ...task,
                trackedTime: convertToMinutes(updatedTrackedTime),
                startTime: null,
                isCompleted: true
            })
        })
        // .then(fetchTasks);
        .then(() => window.location.reload());
    };

    const convertToMinutes = (seconds) => {
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    };

    const convertToSeconds = (timeString) => {
        if (!timeString) return 0;
        const timeParts = timeString.split(" ");
        let totalSeconds = 0;
        timeParts.forEach(part => {
            const unit = part.slice(-1);
            const value = parseInt(part.slice(0, -1));
            if (unit === 'm') totalSeconds += value * 60;
            if (unit === 's') totalSeconds += value;
        });
        return totalSeconds;
    };

    return (
        <div>
            <h2>{task.taskName}</h2>
            <div>Ongoing Time: {Math.floor(elapsedTime / 60)}:{('0' + elapsedTime % 60).slice(-2)}</div>
            <button onClick={startTimer} disabled={isActive}>Start</button>
            <button onClick={stopTimer} disabled={!isActive}>Stop</button>
            <button onClick={removeTask} disabled={task.isCompleted}>Done</button>
            <div>Total Time Tracked: {task.trackedTime || "0m 0s"}</div>
        </div>
    );
}

Timer.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        taskName: PropTypes.string.isRequired,
        startTime: PropTypes.number,
        trackedTime: PropTypes.string,
        isCompleted: PropTypes.bool.isRequired
    }).isRequired
};


export default Timer;
