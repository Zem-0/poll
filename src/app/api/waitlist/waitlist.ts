import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_PORT + "/send-notification";
const API_SECRET = process.env.NEXT_PUBLIC_APISECRET;

export async function sendNotification({
  userName,
  userEmail,
  userTemplate,
  userSubject,
  adminName,
  adminEmail,
  adminTemplate,
  adminSubject,
}: {
  userName: string;
  userEmail: string;
  userTemplate: string;
  userSubject: string;
  adminName: string;
  adminEmail: string;
  adminTemplate: string;
  adminSubject: string;
}) {
  try {
    const payload = {
      user: {
        name: userName,
        email: userEmail,
        template: userTemplate,
        subject: userSubject,
      },
      admin: {
        name: adminName,
        email: adminEmail,
        template: adminTemplate,
        subject: adminSubject,
      },
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        APISECRET: API_SECRET || "",
      },
    });
    return { success: true, message: "Notification sent successfully!" };
  } catch (error: any) {
    console.error("Error sending notification:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Unexpected error occurred.",
    };
  }
}
