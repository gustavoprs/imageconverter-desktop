import { formatBytes, timeAgo } from "@/lib/utils";
import { ClockIcon, DownloadIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useConvertedImages } from "@/contexts/ConvertedImagesContext";
import type { backend } from "wailsjs/go/models";
import { DeleteConvertedImage } from "@/../wailsjs/go/backend/ImageService";

export default function HistoryTabContent(){

	const { convertedImages } = useConvertedImages()

	return (
		<div className="flex flex-col rounded-lg  bg-background shadow">
			<span className=" p-4 text-lg font-medium">Recent Conversions</span>
			<div className=" flex flex-col">
				{convertedImages.map((c, index) => (
					<ConversionCard key={`${c.name}${c.size}${index}`} image={c} />
				))}
				{convertedImages.length == 0 && (
					<span className=" m-4 mt-0 text-center text-sm text-muted-foreground">Convert an image to see it here.</span>
				)}
			</div>
		</div>
	)

}

type ConversionCardProps = {
	image: backend.ConvertedImage
}

function ConversionCard({ image }: ConversionCardProps){

		const { setConvertedImages } = useConvertedImages()

	async function deleteImage() {
		try {
			await DeleteConvertedImage(image.name)

			setConvertedImages(prev => prev.filter(i => i.name !== image.name))
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="flex items-center gap-4 border-t p-3">
			<img src={image.path} alt="" className=" rounded-xs size-12 bg-accent" />
			<div className=" flex flex-col">
				<span className=" text-sm font-medium">{image.name}</span>
				<span className=" inline-flex items-center gap-1 text-xs text-muted-foreground">
					<ClockIcon className="relative bottom-px size-3" /> {timeAgo(new Date(image.modTime))} • {formatBytes(image.size)}
				</span>
			</div>
			<div className=" flex items-center gap-2 ml-auto">
				<Button size="icon" variant="ghost" asChild>
					<a href={image.path} download={image.name}>
						<DownloadIcon />
					</a>
				</Button>
				<Button 
					size="icon" 
					variant="ghost" 
					className=" text-destructive hover:bg-destructive/10 hover:text-destructive"
					onClick={deleteImage}
				>
					<Trash2Icon />
				</Button>
			</div>
		</div>
	)
		
}