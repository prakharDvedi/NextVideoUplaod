import mongoose from "mongoose";

// Constants for video dimensions
export const videoDimensions = {
  WIDTH: 1280,
  HEIGHT: 720,
} as const;

// Interface defining the structure of a Video object
export interface Video {
  title: string; // Title of the video
  description: string; // Description of the video
  url: string; // URL of the video
  thumbnail: string; // URL of the video's thumbnail
  controls: boolean; // Whether video controls are enabled
  transformations?: {
    // Optional transformations for the video
    height: number; // Height of the video
    width: number; // Width of the video
    quality?: number; // Optional quality of the video
  };
  _id: mongoose.Types.ObjectId; // Unique identifier for the video
}

// Mongoose schema for the Video model
const videoSchema = new mongoose.Schema<Video>(
  {
    title: { type: String, required: true }, // Title field
    description: { type: String, required: true }, // Description field
    url: { type: String, required: true }, // URL field
    thumbnail: { type: String, required: true }, // Thumbnail field
    controls: { type: Boolean, required: true }, // Controls field
    transformations: {
      height: { type: Number, default: videoDimensions.HEIGHT, required: true }, // Height with default value
      width: { type: Number, default: videoDimensions.WIDTH, required: true }, // Width with default value
      quality: { type: Number, min: 1, max: 100 }, // Quality with min and max constraints
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create or retrieve the Video model
const VideoModel =
  mongoose.models.Video || mongoose.model<Video>("Video", videoSchema);

export default VideoModel;

/*
Summary of functions:
1. videoDimensions: Defines constant dimensions for videos.
2. Video interface: Describes the structure of a Video object.
3. videoSchema: Mongoose schema for defining the Video model's structure and validation.
4. VideoModel: Creates or retrieves the Video model for database operations.
*/
