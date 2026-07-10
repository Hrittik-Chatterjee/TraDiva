import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the upload directory inside public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure the folder exists
    await mkdir(uploadDir, { recursive: true });

    // Generate a unique filename to prevent overwrites
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;
    const filePath = join(uploadDir, filename);

    // Write file to the local disk
    await writeFile(filePath, buffer);

    // Return the relative URL path served by Next.js static files
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Local file upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
