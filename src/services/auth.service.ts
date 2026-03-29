import { userRepository } from "@/repositories/user.repository";
import { RegisterInput, LoginInput } from "@/validations/auth.schema";
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

  adminLoginService: async (data: LoginInput) => {
    const user = await userRepository.findUserByEmail(data.email);
    if (!user || !user.password) {
      const error = new Error("Email atau password salah");
      (error as any).status = 401;
      throw error;
    }

    const passwordsMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordsMatch) {
      const error = new Error("Email atau password salah");
      (error as any).status = 401;
      throw error;
    }

    if (user.role !== "ADMIN") {
      const error = new Error("Unauthorized: bukan admin");
      (error as any).status = 403;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },
};
