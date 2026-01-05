export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  user: {
    profile: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface SignUpInitRequest {
  email: string;
}

export interface SignUpInitResponse {
  message: string;
}

export interface SignUpConfirmRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignUpConfirmResponse {
  accessToken: string;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
}

export interface UpdateProfileResponse {
  id: string;
  email: string;
  name: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}
