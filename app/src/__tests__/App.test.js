//React/App smoke test
//Compiles and tests for crashes

//TODO: Check for any easily extenable tests to add beyond a smoke

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
