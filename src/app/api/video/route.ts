import { connectToDatabase } from "@/lib/db";
import Video, { Video as IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 });

    if (!videos || videos.length === 0) {
      return NextResponse.json({ message: "No videos found" }, { status: 404 });
    }
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      //check for users.
    }
    await connectToDatabase();

    const body: IVideo = await request.json();

    if (!body.title || !body.description || !body.url || !body.thumbnail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformations: {
        height: 1920,
        width: 1080,
        quality: body?.transformations?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to upload video" },
      { status: 500 }
    );
  }
}
