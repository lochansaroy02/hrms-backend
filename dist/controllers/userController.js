var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const { familyMembers, employeeId, name, pranNo, hrmsId, father, dob, designation, division, postingLocation, gradePay, group, railwayZone, dateOfIssueLater, contact, address, nationality, maritalStatus, height, weight, religion, community, bloodGroup, bankAddress, bankName, ifsc, cif, accountNo, identification, madicalStatus, aadharNumber, password, } = req.body;
        const passwordHash = yield bcrypt.hash(password, 10);
        const isExisted = yield prisma.user.findUnique({
            where: {
                employeeId: employeeId
            }
        });
        if (isExisted) {
            res.status(500).json({ message: 'user already exists' });
        }
        const newUser = yield prisma.user.create({
            //@ts-ignore
            data: {
                employeeId,
                name,
                pranNo,
                hrmsId,
                father,
                dob,
                designation,
                division,
                postingLocation,
                gradePay,
                group,
                railwayZone,
                dateOfIssueLater,
                contact,
                address,
                nationality,
                maritalStatus,
                height,
                weight,
                religion,
                community,
                bloodGroup,
                identification,
                madicalStatus,
                aadharNumber,
                password: passwordHash,
                adminId: adminId,
                familyMembers: familyMembers && familyMembers.length > 0 ? {
                    create: familyMembers.map((member) => (Object.assign(Object.assign({}, member), { age: parseInt(String(member.age), 10) })))
                } : undefined,
                // bank details
                bankAddress, bankName, ifsc, cif, accountNo
            },
            include: {
                familyMembers: true,
                photos: false,
            },
        });
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(400).json({ message: 'A user with this unique identifier already exists.' });
            }
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return res.status(200).json({
            success: true,
            data: users
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
/**
 * 👤 Retrieves a single User by ID.
 * GET /api/users/:id
 */
export const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({
            success: true,
            data: user,
            photoUrl: user.photoUrl
        });
    }
    catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export const getUserbyHRMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hrmsId } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: { hrmsId: hrmsId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({
            success: true,
            data: user,
            photoUrl: user.photoUrl
        });
    }
    catch (error) {
        console.error(`Error fetching user with ID ${hrmsId}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export const getFamily = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield prisma.familyMember.findMany({
            where: {
                userId: id
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export const getNominee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield prisma.familyMember.findMany({
            where: {
                userId: id,
                isNominee: true
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export const getBankDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const bankDetails = yield prisma.user.findFirst({
            where: {
                id: id,
            },
            select: {
                bankAddress: true,
                bankName: true,
                ifsc: true,
                cif: true,
                accountNo: true
            }
        });
        if (!bankDetails) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({
            success: true,
            data: bankDetails
        });
    }
    catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
/**
 * ✍️ Updates an existing User's information (Scalar Fields Only).
 * PUT /api/users/:id
 */
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
            }
        });
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'User not found for update.' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = req.params.employeeId;
        const { password } = req.body;
        if (!password || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Password is required',
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long',
            });
        }
        const user = yield prisma.user.findUnique({
            where: { employeeId },
            select: { id: true },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        yield prisma.user.update({
            where: { employeeId },
            data: { password: hashedPassword },
        });
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
/**
 * 🗑️ Deletes a User.
 * DELETE /api/users/:id
*/
export const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeId = req.params.employeeId;
    try {
        const deletedUser = yield prisma.user.delete({
            where: { employeeId },
            select: { employeeId: true, name: true }
        });
        return res.status(200).json({
            success: true,
            message: `User with ID ${deletedUser.employeeId} deleted successfully.`
        });
    }
    catch (error) {
        console.error(`Error deleting user with ID ${employeeId}:`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'User not found for deletion.' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
//# sourceMappingURL=userController.js.map