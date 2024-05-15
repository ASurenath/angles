import logo from './logo.svg';
import './App.css';
import Angle from './Angle';
import Parallel from './Parallel';
import { useState } from 'react';
import Intersect from './Intersect';
import { Form } from 'react-bootstrap';


function App() {
  const [module, setModule] = useState(0);
  return (
    <div className="App p-3">
      <Form.Select className="w-25" size='lg' onChange={(e) => setModule(e.target.value)} value={module} >
        <option value={0}>Basic types of angles</option>
        <option value={1}>Intersecting lines</option>
        <option value={2}>Line intersecting parallel lines</option>
      </Form.Select>
      {module == 0 && <Angle></Angle>}
      {module == 1 && <Intersect></Intersect>}
      {module == 2 && <Parallel></Parallel>}
    </div>
  );
}

export default App;
