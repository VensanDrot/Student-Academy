import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import { getDecodedToken } from "../../utils/getDecodedToken";

const bindCard = async (req: Request, res: Response): Promise<any> => {
    const { pan, exp, type, holder_name, cvv, phone_number, return_url } = req.body;
    const token = req.headers["x-access-token"] as string;

    const user_id = getDecodedToken(token);

    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    if (!type || !exp || !pan) return res.status(404).json({ message: "Missing Fields" });

    const [month, year] = exp?.split("/") ?? [];
    if (isNaN(month) || isNaN(year)) return res.status(404).json({ message: "Enter correct date" });

    const expMonth = Number(month);
    const expYear = Number(year);

    if (expMonth < 1 || expMonth > 12) {
        return res.status(404).json({ message: "Enter correct date" });
    }

    // Get current month and two-digit year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = Number(now.getFullYear().toString().slice(-2)); // last two digits

    // Check if the expiration date is in the past
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return res.status(404).json({ message: "Card expired" });
    }

    if (type === "visa" || type === "mastercard") {
        if (!holder_name || !cvv) return res.status(404).json({ message: "Missing Fields " });
    } else {
        if (!phone_number) return res.status(404).json({ message: "Missing Fields" });
    }

    try {
        const response = await prisma.paymentMethods.create({
            data: {
                card_number: pan || undefined,
                cvv: cvv || undefined,
                holder_name: holder_name || undefined,
                phone_number: phone_number || undefined,
                type,
                exparation: exp,
                user_id,
            },
            select: {
                card_number: true,
                type: true,
                exparation: true,
            },
        });

        const safeResponse = {
            ...response,
            card_number: response?.card_number?.slice(-4),
        };

        return res.status(200).json({ message: "success", card: safeResponse });
    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default bindCard;
