import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import Home from './pages/dashboard/homePage/home';
import FilesPage from './pages/dashboard/filesPage/FilesPage';
import NewFilePage from './pages/dashboard/newfilePage/NewFilePage'
import Inbox from './pages/dashboard/inbox/Inbox';
import Profile from './pages/dashboard/profile/Profile';
import AdminDash from './pages/AdminDash/AdminDash';
import Analytics from './pages/AdminDash/AnalyticsPage/Analytics';
import AdminHome from './pages/AdminDash/AdminHome/AdminHome';





const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} >
        <Route index element={<Home />} />
        <Route path='/dashboard/files' element={<FilesPage/>}/>
        <Route path='/dashboard/newFile' element={<NewFilePage/>}/>
        <Route path='/dashboard/inbox' element={<Inbox/>}/>
        <Route path='/dashboard/Profile' element={<Profile/>}/>

      </Route>

      {/*admin  side*/}
      <Route path='/admin' element={<AdminDash/>}>
        <Route index element = {<AdminHome/>}/>
        <Route path='/admin/Analytics' element = {<Analytics/>}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;