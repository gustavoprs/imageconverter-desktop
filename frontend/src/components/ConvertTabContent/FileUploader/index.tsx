import { UploadIcon, XIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useRef, useState } from "react";
import { useSelectedImages } from "@/contexts/SelectedImagesContext";
import { cn, formatBytes, getFileHash } from "@/lib/utils";

export default function FileUploader(){

	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const {selectedImages, setSelectedImages} = useSelectedImages()

	const [isDragginOver, setIsDraggingOver] = useState<boolean>(false)
	const dragHoverTimeout = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
  return () => {
    if (dragHoverTimeout.current) {
      clearTimeout(dragHoverTimeout.current)
    }
  }
}, [])

	function openFileSelection(){
		fileInputRef.current?.click()
	}

	// drag and drop
	function handleOnDragOver(e: React.DragEvent<HTMLDivElement>){
		e.preventDefault()
		e.stopPropagation()

		if (!isDragginOver)
			setIsDraggingOver(true)

		if(dragHoverTimeout.current){
			clearTimeout(dragHoverTimeout.current)
		}

		dragHoverTimeout.current = setTimeout(() => {
			setIsDraggingOver(false)
		}, 100)
	}

	function handleOnDrop(e: React.DragEvent<HTMLDivElement>){
		e.preventDefault()
		e.stopPropagation()

		const files = e.dataTransfer.files
		if (!files || files.length === 0) return

		setSelectedImages((prevImages) => [
      ...prevImages,
      ...Array.from(files),
    ]);	
	}

	//others
	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>){
		const files = e.target.files

		if(!files || files?.length == 0) return

   	setSelectedImages((prevImages) => [
      ...prevImages,
      ...Array.from(files),
    ]);	
	}

	async function removeImage(image: File){
  const targetHash = await getFileHash(image)
  const imageHashes = await Promise.all(selectedImages.map(getFileHash))
  const newImages = selectedImages.filter((i, index) => i.name !== image.name || imageHashes[index] !== targetHash)

  setSelectedImages(newImages)
	}

	return (
		selectedImages.length == 0
			? (
				<div className="flex flex-col gap-4 flex-1 rounded-lg p-4 bg-background shadow">
					<span className=" text-lg font-medium">Upload Image</span>
					<div 
						className={cn(
							"relative flex flex-col gap-5 justify-center items-center rounded-lg border-2 border-dashed flex-1 px-2 min-h-64 w-full transition-colors cursor-pointer hover:bg-accent",
							isDragginOver && "border-primary bg-primary/10"
						)}
						onClick={openFileSelection}
						onDragOver={handleOnDragOver}
						onDrop={handleOnDrop}
					>
						<UploadIcon className=" size-12 text-muted-foreground" />
						<div className=" flex flex-col gap-2 text-center">
							<span className=" text-sm text-muted-foreground">Drag & drop an image here, or click to select</span>
							<span className=" text-xs text-muted-foreground">Supports JPG, PNG, WEBP</span>
						</div>
						<Button variant="outline" className="shadow-none">Browse Files</Button>
						<input 
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							className=" hidden"
							onChange={handleFileChange}
						/>
					</div>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-4 rounded-lg p-4 bg-background shadow">
						<span className=" text-lg font-medium">Upload Image</span>
						<div className=" flex flex-col gap-2 max-h-[350px] overflow-auto">
							{selectedImages.map((image, index) => (
								<div key={`${image.type}${image.size}${index}`} className=" flex items-center gap-3 rounded-md p-3 w-full bg-muted">
									<div className=" flex justify-center items-center rounded-xs p-3 h-full aspect-square bg-purple-500/10">
										<UploadIcon className=" text-purple-500" />
									</div>
									<div className=" flex flex-col">
										<span className=" font-medium">{image.name}</span>
										<span className=" text-xs text-muted-foreground">{formatBytes(image.size)}</span>
									</div>
									<Button 
										size="icon"
										variant={"ghost"}
										className=" ml-auto hover:bg-black/5"
										onClick={() => removeImage(image)}
									>
										<XIcon />
									</Button>
								</div>
							))}
						</div>
					</div>
				</>
			)
	)

}