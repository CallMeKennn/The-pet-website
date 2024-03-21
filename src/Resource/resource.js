import DoctorPage from "../Pages/DoctorPage"
import UserPage from "../Pages/UserPage"
import LoginPage from "../Pages/LoginPage"
import PetInfoDetail from "../Pages/PetInfoDetail"

export const pages = [
    {path: "/", page: LoginPage},
    {path: "/doctor", page: DoctorPage},
    {path: "/user", page: UserPage},
    {path: "/petdetail", page: PetInfoDetail},
]