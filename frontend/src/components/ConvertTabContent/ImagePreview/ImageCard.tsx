import { useConversionOptions } from "@/contexts/ConversionOptionsContext";

export function ImageCard({ image }: { image: File }){

	const { outputFormat } = useConversionOptions()

	return (
		<div className=" relative rounded-md max-w-96 w-full overflow-hidden">
			<img 
				src={URL.createObjectURL(image)}
				alt="Selected image preview"
				className="w-full h-full object-cover bg-muted"
			/>
			<div className=" absolute bottom-0 flex justify-between items-center flex-wrap py-1.5 px-2 w-full text-xs bg-black/50 text-white">
				<span className=" text-nowrap truncate">Original: {image.name}</span>
				<span className=" text-nowrap truncate">Output: {`${image.name.substring(0, image.name.lastIndexOf("."))}.${outputFormat}`}</span>
			</div>
		</div>
	)

}