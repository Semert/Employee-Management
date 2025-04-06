// src/index.js
import './components/app-container.js';
import {store} from './redux/store.js';

// Log initial state
console.log('Employee Management Application initialized');
console.log('Initial state:', store.getState());
