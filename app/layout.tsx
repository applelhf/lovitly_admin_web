import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AntdRegistry from "@/components/AntdRegistry";
import ApiInitializer from "@/components/ApiInitializer";
import { ConfigProvider } from "antd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lovitly Admin - 管理后台",
  description: "Lovitly 管理后台系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>
        <ApiInitializer>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1890ff",
                  borderRadius: 6,
                  fontSize: 14,
                },
              }}
            >
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </ApiInitializer>
      </body>
    </html>
  );
}
