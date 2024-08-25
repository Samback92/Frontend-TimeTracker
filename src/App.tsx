import { useEffect, useState } from 'react'
import './App.css'
import Tasks from './Tasks'
import Statistics from './Statistics'

function App() {

  //vilken sida
  const [page, setPage] = useState("");
 
  //url i url fönstret - routing
  useEffect(() => {

    //för att man ska kunna dela en länk

    let pageUrl = page;

    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");

       if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl)
      } else {
        pageUrl = "task"
      }
    } 
    
    window.history.pushState(
      null,
      "",
      "?page=" + pageUrl
    )
  }, [page])
 
  return (
    <>
      <h1>TimeTracker</h1>
      <button onClick={() => setPage("tasks")}>Tasks</button>
      <button onClick={() => setPage("statistics")}>Statistics</button>


    
      {
        { 
          /* Switch som väljer vilken komponent som visas */ 
          "tasks" : <Tasks/>,
          "statistics" : <Statistics/>
        } [page] || <Tasks/>
      }
    </>
  )
}

export default App
