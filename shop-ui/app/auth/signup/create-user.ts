"use server";

import { formError } from "@/app/common/form-error.interface";
import { API_URL } from "@/app/constants/api";
import { getErrorMessage } from "@/app/util/errors";
import { post } from "@/app/util/fetch";
import { redirect } from "next/navigation";

export default async function createUser(_prevState: formError, formData: FormData) {
  const { error } = await post("users", formData);
  if (error) {
    return { error };
  }
  redirect('/')
}
