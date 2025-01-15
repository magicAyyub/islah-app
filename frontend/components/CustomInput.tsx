import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  onChangeValue: (value: string) => void
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, id, onChangeValue, ...props }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        {...props}
        onChange={(e) => onChangeValue(e.target.value)}
        className="transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary"
      />
    </div>
  )
}

