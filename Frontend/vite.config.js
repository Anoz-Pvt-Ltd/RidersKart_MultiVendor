import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.DomainUrl": JSON.stringify(env.DomainUrl),
      "process.env.publicVapidKey": JSON.stringify(env.publicVapidKey),
      "process.env.razorpay_key_id": JSON.stringify(env.razorpay_key_id),
      "process.env.SMS_API_KEY": JSON.stringify(env.SMS_API_KEY),
      "process.env.SMS_CLIENT_ID": JSON.stringify(env.SMS_CLIENT_ID),
    },
    plugins: [react()],
  };
});
