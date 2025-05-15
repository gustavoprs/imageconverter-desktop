import type { outputFormatOptions } from '@/types'
import { createContext, useContext } from 'react'

type ConversionOptionsContextType = {
  outputFormat: outputFormatOptions
  setOutputFormat: (outputFormat: outputFormatOptions) => void
  outputQuality: number
  setOutputQuality: (outputFormat: number) => void
}

const ConversionOptionsContext = createContext<ConversionOptionsContextType | undefined>(undefined)

type ConversionOptionsProviderProps = {
	outputFormat: outputFormatOptions
	setOutputFormat: React.Dispatch<React.SetStateAction<outputFormatOptions>>
	outputQuality: number
  setOutputQuality: (outputFormat: number) => void
	children: React.ReactNode
}

export function ConversionOptionsProvider({ outputFormat, setOutputFormat, outputQuality, setOutputQuality, children }: ConversionOptionsProviderProps) {
  return (
    <ConversionOptionsContext.Provider value={{ outputFormat, setOutputFormat, outputQuality, setOutputQuality }}>
      {children}
    </ConversionOptionsContext.Provider>
  )
}

export function useConversionOptions() {
  const context = useContext(ConversionOptionsContext)
  if (!context) {
    throw new Error('useConversionOptions must be used within a ConversionOptionsProvider')
  }
  return context
}