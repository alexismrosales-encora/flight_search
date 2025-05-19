import { Checkbox, FormControlLabel } from "@mui/material"
import { ChangeEvent, Dispatch, SetStateAction } from "react"

type CheckboxProps = {
  label: string
  checked: boolean
  setChecked: Dispatch<SetStateAction<boolean>>
}
const StyledCheckbox = ({ label, checked, setChecked }: CheckboxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }
  return <FormControlLabel
    label={label}
    control={<Checkbox checked={checked} onChange={handleChange} />}
  />
}

export default StyledCheckbox
