import { cookies } from "next/headers";
import { API_URL } from "../constants/api";
import { getErrorMessage } from "./errors";

const getHeaders = async () => {
  const cookieHeader = await cookies();
  return {
    Cookie: cookieHeader.toString(),
  };
};

export const post = async (path: string, formData: FormData) => {
  const res = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getHeaders()),
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const parsedRes = await res.json();
  if (!res.ok) {
    // console.log(parsedRes);
    return { error: getErrorMessage(parsedRes) };
  }

  return { error: "" };
};

export const get = async (path: string) => {
  const res = await fetch(`${API_URL}/${path}`, {
    headers: { ...(await getHeaders()) },
  });
  return await res.json();
};
