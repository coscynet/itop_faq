import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Context from './context/Context'

import Editor from "./pages/Editor"
import DiagramPage from "./pages/DiagramPage"
import './App.css';

function App() {
  return (
    <Context>
      <BrowserRouter basename="/itop/bpmn">
        <Routes >
          <Route path='/' element={<Editor/>}/>
          <Route path='/diagrama/:id' element={<DiagramPage/>}/>
          <Route path='*' element={<div>Error 404</div>}/>
        </Routes>
      </BrowserRouter>
    </Context>
  );
}

export default App;
