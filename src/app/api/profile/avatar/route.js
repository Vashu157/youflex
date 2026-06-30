import { auth } from "@/auth";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

function normalizeFileName(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "avatar"
  );
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { message: "An avatar image is required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { message: "Please upload an image file" },
        { status: 400 }
      );
    }

    if (file.size > MAX_AVATAR_SIZE) {
      return Response.json(
        { message: "Avatar image must be 5MB or smaller" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicId = `${Date.now()}-${normalizeFileName(file.name)}`;

    const uploadedImage = await uploadBufferToCloudinary(buffer, {
      folder: `youflex/avatars/${session.user.id}`,
      public_id: publicId,
      resource_type: "image",
      overwrite: true,
    });

    return Response.json({
      success: true,
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });
  } catch (error) {
    console.error("avatar upload error:", error);

    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
