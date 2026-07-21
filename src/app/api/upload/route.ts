import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const contentType = file.type || "application/octet-stream";
    const isVideo = contentType.startsWith("video/");
    const maxAllowedSize = isVideo ? 25 * 1024 * 1024 : 10 * 1024 * 1024; // 25MB for videos, 10MB for images

    if (file.size > maxAllowedSize) {
      const maxMb = isVideo ? "25MB" : "10MB";
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of ${maxMb}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename to prevent overwrites
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;

    // 1. If Cloudflare R2 is configured, upload directly to the R2 bucket
    if (isR2Configured && s3Client) {
      console.log(`[R2] Uploading ${filename} to bucket ${R2_BUCKET_NAME}...`);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: filename,
          Body: buffer,
          ContentType: contentType,
        })
      );

      // Return the public URL for the R2 object
      const publicUrl = R2_PUBLIC_URL
        ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${filename}`
        : `/uploads/${filename}`; // fallback relative URL if no public URL is defined

      return NextResponse.json({ url: publicUrl });
    }

    // 2. Fall back to local file system upload for development when R2 is not configured
    console.log(`[R2] Not configured. Falling back to local upload for ${filename}`);
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const localUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: localUrl });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

