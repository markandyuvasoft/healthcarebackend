import express from "express"
import { changeRole, createHospital, deleteHospital, deletePatients, foundHospitalDepartments, foundHospitalDoctors, getAllHospital, getAllUser } from "../../controller/Hospital/hospitalController.js"
import { Token } from "../../../middleware/checkAuth.js"
import { authorized } from "../../../middleware/role.js"


const AdminRouter = express.Router()

// FOR HOSPITAL PURPOSE..............................

AdminRouter.post("/create-hospital",Token, authorized("Admin"), createHospital)

AdminRouter.get("/found-hospitals",Token, authorized("Patient" ,"Doctor", "Admin"), getAllHospital)

AdminRouter.get("/found-hospitals-departments/:hospitalId",Token, authorized("Patient" ,"Doctor", "Admin"), foundHospitalDepartments)

AdminRouter.delete("/delete-hospital/:hospitalId",Token, authorized("Admin"), deleteHospital)


AdminRouter.get("/found-hospital-doctors/:hospitalId",Token, authorized("Patient" ,"Doctor", "Admin"), foundHospitalDoctors)




// FOR CHNAGE ROLE ..................................

AdminRouter.patch("/change-patientRole/:patientId",Token, authorized("Admin"),  changeRole)

AdminRouter.get("/found-all-user",Token, authorized("Admin"), getAllUser)

AdminRouter.delete("/delete-patient/:patientId",Token, authorized("Admin"), deletePatients)




export default AdminRouter