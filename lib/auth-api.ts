import { AdminAuthService } from "@/src/api";
import "@/lib/api-config";

export const authApi = {
  // 管理员登录
  login: async (data: { email: string; password: string }) => {
    const response = await AdminAuthService.postApiV1AdminAuthLogin(data);

    // 保存 token 和 refresh token
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data &&
      typeof response.data === "object"
    ) {
      const responseData = response.data as {
        token?: string;
        refreshToken?: string;
      };

      if (responseData.token) {
        localStorage.setItem("admin_token", responseData.token);
      }
      if (responseData.refreshToken) {
        localStorage.setItem("admin_refresh_token", responseData.refreshToken);
      }
    }

    return response;
  },

  // 刷新 token
  refreshToken: async (refreshToken: string) => {
    return AdminAuthService.postApiV1AdminAuthRefresh({ refreshToken });
  },

  // 获取当前管理员信息
  getMe: async () => {
    return AdminAuthService.getApiV1AdminAuthMe();
  },

  // 更新管理员资料
  updateProfile: async (data: { email?: string }) => {
    return AdminAuthService.putApiV1AdminAuthUpdateProfile(data);
  },

  // 登出
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
  },
};
