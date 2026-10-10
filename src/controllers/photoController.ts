import { Request, Response } from "express";
import prisma from "../utils/prisma.js";
interface PhotoBody {
    // This field can be a single URL string or an array of URL strings
    photoUrl: string | string[];
    // Assuming you link the photos to a specific QR code data or user ID
    qrId: string;
}

export const addPhoto = async (req: Request<{}, {}, any>, res: Response) => {
    try {
        const { photoUrl, userId, aadharUrl, selfieUrl } = req.body;

        if (!photoUrl || !userId || !aadharUrl || !selfieUrl) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: photoUrl, userId, aadharUrl, or selfieUrl",
            });
        }

        const photoUrlsArray: string[] = Array.isArray(photoUrl) ? photoUrl : [photoUrl];

        // Include the missing properties in each object
        const photoData = photoUrlsArray.map(url => ({
            url: url,
            userId: userId,
            aadharUrl: aadharUrl, // Added
            selfieUrl: selfieUrl, // Added
        }));

        let results;
        if (photoData.length === 1) {
            results = await prisma.photos.create({
                data: photoData[0],
            });
        } else {
            results = await prisma.photos.createMany({
                data: photoData,
                skipDuplicates: true,
            });
        }

        return res.status(201).json({
            success: true,
            message: `${photoUrlsArray.length} photo(s) saved successfully.`,
            data: results,
        });

    } catch (error: any) {
        console.error("Error saving photo(s):", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error during photo save.",
            error: error.message
        });
    }
};