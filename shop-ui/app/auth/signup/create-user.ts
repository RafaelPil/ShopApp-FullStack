"use server";

import { API_URL } from "@/app/constants/api";
import { getErrorMessage } from "@/app/util/errors";
import { redirect } from "next/navigation";

export default async function createUser(_prevState: any, formData: FormData) {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const parsedRes = await res.json();
  if (!res.ok) {
    // console.log(parsedRes);
    return { error: getErrorMessage(parsedRes) };
  }

  redirect("/");
}
