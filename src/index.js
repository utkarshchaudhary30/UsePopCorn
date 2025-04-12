import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import Starrating from './Starrating';
import './index.css';
import App from './App';
// function Test(){
//   const [movierating,setmovierating]=useState(0)
//   return(
//     <div>
//       <Starrating color='blue'maxrating={10} onrating={setmovierating}/>
//       <p>This movie was rated {movierating} </p>
//     </div>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Starrating maxrating={5} messages={['terrible','bad','okay','good','amazing']}/>
    <Starrating size={24} color='green' className="test" defaultrating={3}/>
    <Test/> */}
  </React.StrictMode>
);

