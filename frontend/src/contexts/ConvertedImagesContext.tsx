import { createContext, useContext } from 'react'
import type { backend } from 'wailsjs/go/models'

type ConvertedImagesContextType = {
  convertedImages: backend.ConvertedImage[]
  setConvertedImages: React.Dispatch<React.SetStateAction<backend.ConvertedImage[]>>
}

const ConvertedImagesContext = createContext<ConvertedImagesContextType | undefined>(undefined)

type ConvertedImagesProviderProps = {
	convertedImages: backend.ConvertedImage[]
	setConvertedImages: React.Dispatch<React.SetStateAction<backend.ConvertedImage[]>>
	children: React.ReactNode
}

export function ConvertedImagesProvider({ convertedImages, setConvertedImages, children }: ConvertedImagesProviderProps) {
  return (
    <ConvertedImagesContext.Provider value={{ convertedImages, setConvertedImages }}>
      {children}
    </ConvertedImagesContext.Provider>
  )
}

export function useConvertedImages() {
  const context = useContext(ConvertedImagesContext)
  if (!context) {
    throw new Error('useConvertedImages must be used within a ConvertedImagesProvider')
  }
  return context
}