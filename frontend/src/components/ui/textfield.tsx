import TextField from '@mui/material/TextField';

interface LoginRegisterTextFieldProps {
  placeholder: string;
  className?: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function LoginRegisterTextField({ placeholder, className, type, onChange }: LoginRegisterTextFieldProps) {
  return (
    <TextField
      className={className}
      label={placeholder}
      variant="outlined"
      type={type}
      onChange={onChange}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#9CA3AF',
          },
          '&:hover fieldset': {
            borderColor: '#9CA3AF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#9CA3AF',
          },
          '& input': {
            color: '#E5E7EB',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#ffffff',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#ffffff',
        },
      }}
    />
  )
}

export { LoginRegisterTextField }