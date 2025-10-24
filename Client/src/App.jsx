import './App.css'
import LandingPage from './pages/LandingPage.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import PostItem from './pages/PostItem.jsx';
import BrowseItems from './pages/BrowseItems.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import EditItem from './pages/EditItem.jsx';
import Messages from './pages/Messages.jsx';
import MessagesInbox from './pages/MessagesInbox.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path='/post-item' element={<ProtectedRoute><PostItem/></ProtectedRoute>}/>
          <Route path='/browse' element={<ProtectedRoute><BrowseItems/></ProtectedRoute>}/>
          <Route path='/item/:id' element={<ProtectedRoute><ItemDetail/></ProtectedRoute>}/>
          <Route path='/item/:id/edit' element={<ProtectedRoute><EditItem/></ProtectedRoute>}/>
          <Route path='/messages' element={<ProtectedRoute><MessagesInbox/></ProtectedRoute>}/>
          <Route path='/messages/:id' element={<ProtectedRoute><Messages/></ProtectedRoute>}/>
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
