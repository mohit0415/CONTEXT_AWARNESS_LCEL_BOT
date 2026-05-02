import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { persistor, store } from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react'

import { PrimeReactProvider } from 'primereact/api'

import "primereact/resources/themes/lara-dark-blue/theme.css";  // theme
import "primereact/resources/primereact.min.css";              // core
import "primeicons/primeicons.css";                            // icons

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PrimeReactProvider>
        <App />
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
