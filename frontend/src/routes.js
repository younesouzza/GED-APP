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
import ReDashboard from './pages/re-Dashnoard/sd-Dashboard';
import HomePage from './pages/re-Dashnoard/home/homePage';
import Sfilepage from './pages/re-Dashnoard/filePage/Sfilepage';
import CreateFolder from './pages/re-Dashnoard/createFolder/CreateFolder';
import ProfilePage from './pages/re-Dashnoard/profile/ProfilePage';
import ManageUsers from './pages/AdminDash/manage users/ManageUsers';





const AppRoutes = () => {
  return (
             
    <Routes>
        {/*reviewer role side */}
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
        <Route path='/admin/manageusers' element = {<ManageUsers/>}/>
      </Route>
      
        {/* standard side */}
        <Route path='/sd-dashboard' element={<ReDashboard/>}>
          <Route index element={<HomePage/>}/>
          <Route path='/sd-dashboard/files' element={<Sfilepage/>}/>
          <Route path='/sd-dashboard/newfile' element={<CreateFolder/>}/>
          <Route path='/sd-dashboard/profile' element={<ProfilePage/>}/>
          

        </Route>

    </Routes>

       
  );
};

export default AppRoutes;