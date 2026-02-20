"use client";

import React from "react";
import { Layout, Menu, Avatar, Dropdown, Typography } from "antd";
import { useRouter, usePathname } from "next/navigation";
import {
  UserOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ShopOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { authApi } from "@/lib/auth-api";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [adminInfo, setAdminInfo] = React.useState<{ email: string } | null>(
    null
  );

  React.useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (user) {
      setAdminInfo(JSON.parse(user));
    }
  }, [router]);

  const handleLogout = () => {
    authApi.logout();
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "仪表盘",
    },
    {
      key: "/dashboard/users",
      icon: <UserOutlined />,
      label: "个人用户",
    },
    {
      key: "/dashboard/bizUsers",
      icon: <ShopOutlined />,
      label: "商家用户",
    },
    {
      key: "/dashboard/aiUsers",
      icon: <UserOutlined />,
      label: "AI 员工",
    },
    {
      key: "/dashboard/categories",
      icon: <AppstoreOutlined />,
      label: "分类管理",
    },
    {
      key: "/dashboard/votings",
      icon: <BarChartOutlined />,
      label: "投票管理",
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: collapsed ? 14 : 18,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "LA" : "Lovitly Admin"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}
      >
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <Text>{adminInfo?.email || "Admin"}</Text>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: "24px", minHeight: 280 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
