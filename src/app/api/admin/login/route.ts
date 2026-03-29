import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate body
    const validatedFields = loginSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Call service
    const data = await authService.adminLoginService(validatedFields.data);

    return NextResponse.json(
      {
        success: true,
        message: "Login admin berhasil",
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}
