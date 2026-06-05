export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  credits: number;
  plan: 'free' | 'pro' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  style: VideoStyle;
  duration: number;
  resolution: string;
  aspect_ratio: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  thumbnail_url: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail_url: string;
  preview_url: string;
  prompt_template: string;
  style: VideoStyle;
  duration: number;
  is_pro: boolean;
  created_at: string;
}

export type VideoStyle =
  | 'cinematic'
  | 'anime'
  | 'realistic'
  | 'marketing'
  | 'educational'
  | 'documentary'
  | 'fantasy'
  | 'gaming';

export type VideoResolution = '720p' | '1080p' | '4K';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';

export interface CreateVideoForm {
  prompt: string;
  style: VideoStyle;
  duration: number;
  resolution: VideoResolution;
  aspect_ratio: AspectRatio;
  voice_language: string;
  background_music: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  credits: number;
  highlighted: boolean;
  badge?: string;
}
