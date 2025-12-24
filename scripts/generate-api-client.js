/* eslint-disable @typescript-eslint/no-require-imports */
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const BACKEND_URL = process.env.API_GEN_URL || "http://localhost:5003";
const OUTPUT_DIR = path.join(__dirname, "..", "src", "api");

// Swagger JSON 端点
const SWAGGER_ENDPOINTS = {
  admin: `${BACKEND_URL}/api-docs/admin.json`,
  user: `${BACKEND_URL}/api-docs/user.json`,
  biz: `${BACKEND_URL}/api-docs/biz.json`,
};

async function fetchSwaggerSpec(url) {
  const https = require("https");
  const http = require("http");

  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function generateClient() {
  try {
    console.log("🚀 开始生成 API 客户端...\n");

    // 创建临时目录存储 swagger 规范
    const tempDir = path.join(__dirname, "..", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // 获取 Admin API 的 Swagger 规范
    console.log("📥 获取 Admin API Swagger 规范...");
    const adminSpec = await fetchSwaggerSpec(SWAGGER_ENDPOINTS.admin);
    const adminSpecPath = path.join(tempDir, "admin-swagger.json");
    fs.writeFileSync(adminSpecPath, JSON.stringify(adminSpec, null, 2));
    console.log("✅ Admin API 规范已保存\n");

    // 生成 TypeScript 客户端
    console.log("⚙️  生成 TypeScript 客户端代码...");

    const command = `npx openapi-typescript-codegen --input ${adminSpecPath} --output ${OUTPUT_DIR} --client axios`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ 生成失败:", error);
        return;
      }

      if (stderr) {
        console.error("⚠️  警告:", stderr);
      }

      console.log(stdout);
      console.log("✅ API 客户端代码生成成功！");
      console.log(`📁 输出目录: ${OUTPUT_DIR}\n`);

      // 清理临时文件
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log("🧹 临时文件已清理");
    });
  } catch (error) {
    console.error("❌ 错误:", error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n💡 请确保后端服务正在运行在 http://localhost:5003");
      console.error(
        "   运行命令: cd backend/lovitly_admin_backend && npm run dev\n"
      );
    }
  }
}

generateClient();
