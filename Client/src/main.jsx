import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import ThemeProvider from './components/ThemeProvider.jsx'
import { getCurrentUser } from '../apiCalls/userCalls.js'
import { setUserData } from './redux/userSlice.js'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ThemeProvider>
);

// Fetch current user on app start and populate redux store (silent fail)
;(async () => {
  try {
    const user = await getCurrentUser();
    if (user) store.dispatch(setUserData(user));
  } catch (e) {
    // Not signed in or failed - ignore to allow public routes
  }
})();
