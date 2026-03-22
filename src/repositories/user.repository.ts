import prisma from "@/lib/prisma";
import { RegisterInput } from "@/validations/auth.schema";

export const userRepository = {
  findUserByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  createUser: async (data: RegisterInput & { passwordHash: string }) => {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        role: "USER", // Default role as specified
      },
    });
  },
};
