import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, GIF allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filename = `card_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "cards");

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      url: `/cards/${filename}`,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
