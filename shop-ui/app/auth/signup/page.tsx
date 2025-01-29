"use client";
import { Button, Link, Stack, TextField } from "@mui/material";
import React, { useActionState } from "react";
import NextLink from "next/link";
import createUser from "./create-user";

const Signup = () => {
  const [state, formAction] = useActionState(createUser, { error: "" });

  return (
    <form action={formAction} className="w-full max-w-xs">
      <Stack spacing={2}>
        <TextField label="Email" variant="outlined" type="email" />
        <TextField label="Password" variant="outlined" type="password" />
        <Button type="submit" variant="contained">
          Signup
        </Button>
        <Link component={NextLink} href="/auth/login" className="self-center">
          Login
        </Link>
      </Stack>
    </form>
  );
};

export default Signup;
