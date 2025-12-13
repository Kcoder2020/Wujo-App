export interface UserResponse {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female';
  role: 'collector' | 'member';
  profile_picture_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SignupRequest {
  name: string;
  phone: string;
  gender: 'male' | 'female';
  role: 'collector' | 'member';
  password: string;
  password_confirmation: string;
  email?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}
