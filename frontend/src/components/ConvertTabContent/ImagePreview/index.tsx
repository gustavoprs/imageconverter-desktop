import { useSelectedImages } from "@/contexts/SelectedImagesContext"
import { cn, downloadImage } from "@/lib/utils"
import { ImageCard } from "./ImageCard"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { ConvertBase64Image } from "@/../wailsjs/go/backend/ImageService"
import { useConversionOptions } from "@/contexts/ConversionOptionsContext"
import type { backend } from "wailsjs/go/models"
import { useConvertedImages } from "@/contexts/ConvertedImagesContext"
import { toast } from "sonner"

export default function ImagePreview(){

	const { selectedImages, setSelectedImages } = useSelectedImages()
	const { outputFormat, outputQuality } = useConversionOptions()
	const { setConvertedImages } = useConvertedImages()

	async function handleImageConversionAndDownload() {
		const tasks = selectedImages.map(file => {
			return new Promise<void>((resolve, reject) => {
				const reader = new FileReader()
				reader.onload = async () => {
					const base64Data = (reader.result as string).split(",")[1]
					const filename = file.name

					try {
						await ConvertBase64Image(filename, base64Data, outputFormat, outputQuality)

						const convertedImage = {
							name: `${filename.substring(0, filename.lastIndexOf("."))}.${outputFormat}`,
							modTime: new Date(),
							size: file.size,
							path: `data:image/${outputFormat};base64,${base64Data}`
						}

						downloadImage(convertedImage as backend.ConvertedImage)
						setConvertedImages(prev =>
							[...prev.filter(i => i.name !== convertedImage.name), convertedImage as backend.ConvertedImage]
						)

						resolve()
					} catch (error) {
						console.error(error)
						reject()
					}
				}

				reader.readAsDataURL(file)
			})
		})

		const results = await Promise.allSettled(tasks)

		const successCount = results.filter(r => r.status === "fulfilled").length
		const errorCount = results.length - successCount

		if (errorCount === 0) {
			toast.success(
				selectedImages.length === 1
					? "Image converted successfully"
					: "All images converted successfully"
			)
		} else if (successCount > 0) {
			toast(
				`${successCount} out of ${selectedImages.length} images converted successfully`
			)
		} else {
			toast.error("Oops... something went wrong.")
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
						onClick={handleImageConversionAndDownload}
					>
						<DownloadIcon />
						Convert & Download
					</Button>
				</div>
		</div> 
	)

}

