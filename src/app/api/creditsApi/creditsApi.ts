// lib/api/creditsApi.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_PORT;

export const getCreditBalance = async (jwtToken: string) => {
    const res = await fetch(`${BASE_URL}/credits/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        JWTToken: jwtToken, 
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch credit balance");
    }
  
    return res.json();
  };

export async function addCredits(jwtToken: string, amount: number, description: string, metadata: object = {}) {
  return axios.post(
    `${BASE_URL}/credits/add`,
    {
      amount,
      description,
      metadata,
    },
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
    }
  );
}

// More APIs like deductCredits, listCreditHistory etc. can be added here.
