
//image format
export type outputFormatOptions = "png" | "jpg" | "jpeg"

export interface FormatOption {
  value: outputFormatOptions
  label: string
}

export const formatOptions: FormatOption[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'jpeg', label: 'JPEG' }
]