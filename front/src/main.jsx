import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {InitialState} from './context/InitialState'
import {StoreProvider} from './context/Store'
import {MainReducer} from './context/reducers'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider initialState={InitialState} reducer={MainReducer}>
    <App />
    </StoreProvider>
  </StrictMode>,
)
