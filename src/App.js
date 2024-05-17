import logo from './logo.svg';
import './App.css';
import Angle from './components/Angle';
import Parallel from './components/Parallel';
import { useState } from 'react';
import Intersect from './components/Intersect';
import { Form } from 'react-bootstrap';
import Triangle from './components/Triangle';


function App() {
  const [module, setModule] = useState(0);
  return (
    <div className="App">
      <h1 className='text-center'>Angles</h1>
      <div className='d-flex justify-content-center align-items-center p-3'>
        <label for="module" className="fs-3 text-center">Select module :&nbsp; </label>
        <Form.Select className="w-100 fs-3 text-center title-select" size='lg' onChange={(e) => setModule(e.target.value)} value={module} id='module'>
          <option value={0}>Basic types of angles</option>
          <option value={1}>Intersecting lines</option>
          <option value={2}>Line intersecting parallel lines</option>
          <option value={3}>Types of triangles based on angles</option>
        </Form.Select>
      </div>
      {module == 0 && <Angle></Angle>}
      {module == 1 && <Intersect></Intersect>}
      {module == 2 && <Parallel></Parallel>}
      {module == 3 && <Triangle></Triangle>}
    </div>
  );
}

export default App;
