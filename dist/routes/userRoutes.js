import express from "express";
import { deleteUser, getBankDetails, getFamily, getNominee, getUserbyHRMS, getUserById, resetPassword } from "../controllers/userController.js";
const router = express.Router();
router.get("/get-user/:id", getUserById);
router.get("/get-family/:id", getFamily);
router.get("/get-nominee/:id", getNominee);
router.get("/get-bank/:id", getBankDetails);
router.get("/get-user", getUserbyHRMS);
router.get("/detele-user", deleteUser);
router.patch('/:employeeId/reset-password', resetPassword);
export default router;
//# sourceMappingURL=userRoutes.js.map