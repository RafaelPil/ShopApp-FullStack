"use server";

import { formError } from "@/app/common/form-error.interface";
import { API_URL } from "@/app/constants/api";
import { getErrorMessage } from "@/app/util/errors";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import { redirect } from "next/navigation";

export default async function login(_prevState: formError, formData: FormData) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const parsedRes = await res.json();
  if (!res.ok) {
    // console.log(parsedRes);
    return { error: getErrorMessage(parsedRes) };
  }

  setAuthCookie(res);
  redirect("/");
}

const setAuthCookie = async (response: Response) => {
  const setCookieHeader = response.headers.get("Set-Cookie");
  if (setCookieHeader) {
    const token = setCookieHeader.split(";")[0].split("=")[1];
    (await cookies()).set({
      name: "Authentication",
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(token).exp! * 1000),
    });
  }
};
