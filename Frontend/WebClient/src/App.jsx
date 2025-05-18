import React from 'react';
import AppRouter from './router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; // Import useSelector
import { BrowserRouter } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.role); // LẤY userRole TỪ REDUX

  return (
    <  >
      <AppRouter />
    </>
  );
}

export default App;