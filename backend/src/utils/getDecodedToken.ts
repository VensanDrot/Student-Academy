import jwt from "jsonwebtoken";

export const getDecodedToken = (token: string) => {
    if (!token) {
        return null;
    }

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        if (!decoded.id) return null;

        return parseInt(decoded.id, 10);
    } catch (error) {
        return null;
    }
};
