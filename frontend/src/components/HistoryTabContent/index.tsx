import { useConvertedImages } from "@/contexts/ConvertedImagesContext";
import ConversionCard from "./ConversionCard";

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

