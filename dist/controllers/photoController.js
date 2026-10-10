var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../utils/prisma.js";
export const addPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { photoUrl, userId, aadharUrl, selfieUrl } = req.body;
        if (!photoUrl || !userId || !aadharUrl || !selfieUrl) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: photoUrl, userId, aadharUrl, or selfieUrl",
            });
        }
        const photoUrlsArray = Array.isArray(photoUrl) ? photoUrl : [photoUrl];
        // Include the missing properties in each object
        const photoData = photoUrlsArray.map(url => ({
            url: url,
            userId: userId,
            aadharUrl: aadharUrl, // Added
            selfieUrl: selfieUrl, // Added
        }));
        let results;
        if (photoData.length === 1) {
            results = yield prisma.photos.create({
                data: photoData[0],
            });
        }
        else {
            results = yield prisma.photos.createMany({
                data: photoData,
                skipDuplicates: true,
            });
        }
        return res.status(201).json({
            success: true,
            message: `${photoUrlsArray.length} photo(s) saved successfully.`,
            data: results,
        });
    }
    catch (error) {
        console.error("Error saving photo(s):", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error during photo save.",
            error: error.message
        });
    }
});
//# sourceMappingURL=photoController.js.map