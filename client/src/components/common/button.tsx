import { Button as ButtonMui, ButtonProps } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import { ReactNode } from "react";

type CustomProps = {
  children: ReactNode
} & ButtonProps

const StyledButton = styled(ButtonMui)(({ theme }) => ({

  borderRadius: theme.shape.borderRadius,
  padding: "10px 20px",
  fontWeight: "600",
  textTransform: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",

  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
}));

const Button = ({ children, ...muiProps }: CustomProps) => {
  return <StyledButton {...muiProps}>{children}</StyledButton>
}

export default Button

