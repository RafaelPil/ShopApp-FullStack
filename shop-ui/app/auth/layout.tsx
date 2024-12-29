import { Box } from "@mui/material";

export default function AuthLayoout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className="h-screen flex items-center justify-center">{children}</Box>
  );
}