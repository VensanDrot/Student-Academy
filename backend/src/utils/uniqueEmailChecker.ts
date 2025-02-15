import prisma from "../../prisma";

const uniqueEmailChecker = async (email: string) => {
    if (!email) {
        return false;
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await prisma.users.findUnique({
            where: {
                email
            },
        });

        if (existingUser) {
            return existingUser;
        }
    } catch (error) {
        console.error("Error checking email uniqueness:", error);
        return false;
    }
    return true;
};

export default uniqueEmailChecker;
