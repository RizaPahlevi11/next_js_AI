import { userRepository } from "@/repositories/user.repository";
import { RegisterInput } from "@/validations/auth.schema";
import bcrypt from "bcrypt";

export const authService = {
  registerUser: async (data: RegisterInput) => {
    // Check if user already exists
    const existingUser = await userRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash password before sending to repository
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    // Call data access layer
    return await userRepository.createUser({
      email: data.email,
      password: data.password, 
      passwordHash,
    });
  },
};
