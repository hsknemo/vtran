

declare namespace LoginNamespaceService {
  export interface LoginResponseUser  {
    id: string,
    username: string,
  }

  export interface LoginResponse {
    msg: string
    data: {
      token: string;
      data: LoginResponseUser
    };
  }
}
