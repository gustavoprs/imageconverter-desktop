import { createContext, useContext } from 'react'

type SelectedImagesContextType = {
  selectedImages: File[]
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>
}

const SelectedImagesContext = createContext<SelectedImagesContextType | undefined>(undefined)

type SelectedImagesProviderProps = {
	selectedImages: File[]
	setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>
	children: React.ReactNode
}

export function SelectedImagesProvider({ selectedImages, setSelectedImages, children }: SelectedImagesProviderProps) {
  return (
    <SelectedImagesContext.Provider value={{ selectedImages, setSelectedImages }}>
      {children}
    </SelectedImagesContext.Provider>
  )
}

export function useSelectedImages() {
  const context = useContext(SelectedImagesContext)
  if (!context) {
    throw new Error('useSelectedImages must be used within a SelectedImagesProvider')
  }
  return context
}