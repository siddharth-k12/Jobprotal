import {Route,Routes} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Job from '../pages/job/Job'
import JobId from '../components/JobId'
import Profile from '../pages/user/Profile'
import Recruiter from '../pages/user/Recruiter'
import CreateJob from '../pages/job/CreateJob'
import MyJobs from '../pages/job/MyJobs'
import CreateCompany from '../pages/company/CreateCompany'
import Mycompany from '../pages/company/Mycompany'
import Companypart from '../pages/company/Companypart'
import CompanyJob from '../pages/job/CompanyJob'
import EditJob from '../pages/job/EditJob'
import EditUser from "../pages/profileSection/EditUser"
import EditEducation from '../pages/profileSection/EditEducation'
import ProfileEdit from '../pages/profileSection/ProfileEdit'
import EditExpericene from '../pages/profileSection/EditExpericene'
import Education from '../pages/candiadate/Education'
import Expericen from '../pages/candiadate/Expericen'
import UserJobDeatil from '../pages/candiadate/UserJobDeatil'
import Application from '../pages/job/Application'
import EditCompany from '../pages/job/EditCompany'
// import Saved from '../pages/user/Saved'

const MainRouters = () => {
  return (
    <div>
        <Routes>
             {/* user  */}
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/home' element={<Home/>}/>
            {/* <Route path='/saved-jobs' element={<Saved/>} /> */}

            {/* Job */}
            <Route path='/job' element={<Job/>}/>
            <Route path='/job/:jobId'element={<JobId/>} />
            <Route path="/my-jobs" element={<MyJobs />} />
            {/* Profile */}
            <Route path='/profile'element={<Profile/>} />
            {/* recuriter */}
            <Route path='/recruiter' element={<Recruiter/>}/>
            <Route path='/recruiter/company' element={<CreateCompany/>}/>
            <Route path='/recruiter/job' element={<CreateJob/>}/>

            {/* <Route path='/recruiter/my-jobs' element={<MyJobs/>}/> */}

            <Route path='/recruiter/mycompany' element={<Mycompany/>}/>
            <Route path='/recruiter/edit-job/:companyId/:jobId' element={<EditJob/>}/>
            <Route path="/application/:jobId" element={<Application/>} />

            {/* Comaponay  */}

            <Route path='/company-part' element={<Companypart/>} />
            <Route path='/company-job/:companyId' element={<CompanyJob/>} />
            <Route path='/company-edit/:companyId'element={<EditCompany/>} />
            
            {/* canidate Edit option */}
            <Route path='/edit-user' element={<EditUser/>} />
            <Route path='/edit-education/:educationId' element={<EditEducation/>} />
             <Route path='/edit-profile' element={< ProfileEdit/>} /> 
            <Route path='/edit-experience/:experienceId' element={<EditExpericene/>} />

          {/* candidate Person deatils */}
          <Route path='/education' element={<Education/>}/>
          <Route path='/experience' element={<Expericen/>}/>
          <Route path='/user-job' element={<UserJobDeatil/>}/>

</Routes>            
    </div>
  )
}

export default MainRouters