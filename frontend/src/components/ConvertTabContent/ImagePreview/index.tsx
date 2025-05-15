import { useSelectedImages } from "@/contexts/SelectedImagesContext"
import { cn, downloadImage } from "@/lib/utils"
import { ImageCard } from "./ImageCard"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { ConvertBase64Image } from "@/../wailsjs/go/backend/ImageService"
import { useConversionOptions } from "@/contexts/ConversionOptionsContext"
import type { backend } from "wailsjs/go/models"
import { useConvertedImages } from "@/contexts/ConvertedImagesContext"

export default function ImagePreview(){

	const { selectedImages, setSelectedImages } = useSelectedImages()
	const { outputFormat, outputQuality } = useConversionOptions()
	const { setConvertedImages } = useConvertedImages()

	async function handleImageUpload() {
		for (const file of selectedImages) {
			const reader = new FileReader()
			reader.onload = async () => {
				const base64Data = (reader.result as string).split(",")[1]
				const filename = file.name

				try {
					const outPath = await ConvertBase64Image(filename, base64Data, outputFormat, outputQuality)
					console.log(outPath)

					const convertedImage = {
						name: `${file.name.substring(0, file.name.lastIndexOf("."))}.${outputFormat}`,
						modTime: new Date(),
						size: file.size,
						path: `data:image/${outputFormat};base64,${base64Data}`
					}

					downloadImage(convertedImage as backend.ConvertedImage)
					setConvertedImages(prev => [...prev.filter(i => i.name !== convertedImage.name), convertedImage as backend.ConvertedImage])
				} catch (error){
					console.error(error)
				}
			}

			reader.readAsDataURL(file)
		}

		setSelectedImages([])
	}

	return (
		<div className="flex flex-col gap-4 rounded-lg p-4 bg-background shadow">
			<span className=" text-lg font-medium">Preview</span>
				<div className={cn(
					"grid justify-center gap-2",
					selectedImages.length === 2 && 'grid-cols-2',
					selectedImages.length === 3 && 'grid-cols-3',
					selectedImages.length >= 4 && 'grid-cols-4'
				)}>
					{selectedImages.map((image, index) => <ImageCard key={`${image.name}${image.size}${index}`} image={image} />)}
				</div>
				<div className=" flex justify-end items-center">
					<Button
						onClick={handleImageUpload}
					>
						<DownloadIcon />
						Convert & Download
					</Button>
				</div>
		</div> 
	)

}

