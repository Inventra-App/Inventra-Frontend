import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store.js'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <Toaster position='top-right' reverseOrder={false} />
    <App />
    </PersistGate>
    </Provider>
  // </StrictMode>,
)
