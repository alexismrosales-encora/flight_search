import { Switch, FormControlLabel } from "@mui/material"
import { Dispatch, SetStateAction } from "react"

type BinaryToggleProps = {
  enabledLabel: string
  disabledLabel: string
  checked: boolean | undefined
  setChecked: Dispatch<SetStateAction<boolean>>
}
const BinaryToggle = ({ enabledLabel, disabledLabel, checked, setChecked }: BinaryToggleProps) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      }
      label={checked ? enabledLabel : disabledLabel}
    />
  )
}

export default BinaryToggle
