import React, { useState } from "react";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { sendNotification } from "@/app/api/waitlist/waitlist";

const adminTemplate = (name: string, email: string) => `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
  <h1 style="color: #6244d6; font-size: 24px; font-weight: bold">
    New Waitlist Entry
  </h1>
  <p style="font-size: 16px; margin-top: 20px">
    A new user has joined the PollVault waitlist.
  </p>
  <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
    <tr>
      <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Name</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Email</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
    </tr>
  </table>
  <p style="margin-top: 30px; font-size: 14px; color: #888;">
    This notification was sent automatically by PollVault.
  </p>
</div>
`;

const userTemplate = (name: string) => (   `
<div style="font-family: Arial, sans-serif; text-align: center; color: #333; line-height: 1.5;">
      <img
        src="https://i.ibb.co/5knRTxV/image.png"
        alt="PollVault Logo"
        style="width: 150px; margin-bottom: 20px"
      />
      <h1 style="color: #6244d6; font-size: 28px; font-weight: bold">
        Welcome to PollVault, ${name}!
      </h1>
      <p style="font-size: 16px; margin-top: 20px">
        Thank you for joining our waitlist! We are thrilled to have you as part
        of our growing community.
      </p>
      <p style="font-size: 16px">
        With PollVault, you'll soon experience a new way to interact with polls
        and insights. Stay tuned for exciting updates and features!
      </p>
      <a
      href="https://pollvault.ing/"
      target="_blank"
        style="
          display: inline-block;
          margin-top: 30px;
          background: linear-gradient(90deg, #6244d6, #2b6ce1);
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
        "
      >
        Visit PollVault
      </a>
      <p style="margin-top: 30px; font-size: 14px; color: #888">
        If you have any questions, feel free to reach out to us at
        <a href="mailto:pollvaultus@gmail.com" style="color: #6244d6"
          >pollvaultus@gmail.com</a
        >.
      </p>
      <p style="font-size: 14px; color: #888; margin-top: 10px;">
        Cheers 🎉,  The PollVault Team
      </p>
    </div>
`)

interface WaitlistFormProps {
  onSuccess: () => void; // Callback for successful submission
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const apiSchema = {
      userName: name,
      userEmail: email,
      userTemplate: userTemplate(name),
      userSubject: "Welcome to PollVault Waitlist!",
      adminName: "PollVault Team",
      adminEmail: process.env.GMAIL_ADMIN || "pollvaultus@gmail.com",
      adminTemplate: adminTemplate(name, email),
      adminSubject: `New Waitlist Entry: ${name}`,
    }

    try {
      const response = await sendNotification(apiSchema);
    
      if (response.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        onSuccess();
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg border rounded-md text-center">
      {success ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-green-600 text-lg font-bold mb-4">
            Thank you for joining the waitlist! 🎉
          </p>
          <Button
            label="Join Again"
            type="gradient"
            customCss="mt-4"
            onClick={() => setSuccess(false)}
          />
        </div>
      ) : (
        <>
          <Text variant="h3" extraCSS="text-[#183D81]">
            Be first. Be heard.
          </Text>
          <p className="mt-2 text-sm text-gray-500">
            Join our waitlist for AI interviews that feel like you're actually there.
          </p>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <Button
              label="Join Waitlist"
              type="gradient"
              customCss="mt-4 w-full"
              loading={isSubmitting}
              disabled={isSubmitting || !name.trim() || !email.trim()} 
            />
          </form>
          {errorMessage && (
            <p className="mt-4 text-red-600">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
};
export default WaitlistForm;
