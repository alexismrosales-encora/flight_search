import { TextField, TextFieldProps } from "@mui/material"
import { styled } from "@mui/material"

type LabeledTextFieldProps = {
  label: string
} & TextFieldProps

const StyledTextField = styled(TextField)(({ theme }) => ({
  background: "white",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",

  // Apply padding inside the input, not on the outer component
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
    padding: "10px 12px",
    fontWeight: 500,
  },

  // Label styling
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },

  // Focused styling
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.15)",
    },
  },
}))

const TextFieldInput = ({ label, ...props }: LabeledTextFieldProps) => {
  return (
    <StyledTextField
      label={label}
      variant="outlined"
      fullWidth
      margin="normal"
      {...props}
    />
  )
}

export default TextFieldInput
