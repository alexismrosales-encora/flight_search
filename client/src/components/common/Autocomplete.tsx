import { Autocomplete, TextField } from "@mui/material";


const Selector = ({ label, value, onChange, onInputChange, options }: {
  label: string
  value: any | null
  onChange: (newValue: any | null) => void
  onInputChange?: (newInputValue: string) => void
  options: string[]
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue) => {
        if (onInputChange) {
          onInputChange(newInputValue);
        }
      }}
      renderInput={(params) => <TextField {...params} label={label} fullWidth />}
    />
  )
}

export default Selector 
