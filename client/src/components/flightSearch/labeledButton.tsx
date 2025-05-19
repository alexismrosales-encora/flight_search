import { Button, ButtonProps } from "@mui/material"
import { styled } from "@mui/material"


const StyledButton = styled(Button)(({ theme }) => ({
  background: "white",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  fontWeight: 500,
  textTransform: "none",
  padding: "10px 12px",
  color: theme.palette.text.primary,

  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
    background: "white",
  },

  "&:active": {
    transform: "scale(0.98)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  "&.Mui-disabled": {
    backgroundColor: "#f5f5f5",
    color: "#aaa",
    boxShadow: "none",
  },
}))

type Props = {
  label: string
  value: string | number | any
} & ButtonProps

const labeledButton = ({ label, value, ...muiProps }: Props) => {
  return <StyledButton {...muiProps}>
    {label}
    <br />
    {value}
  </StyledButton>
}

export default labeledButton 
