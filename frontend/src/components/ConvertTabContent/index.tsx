import { useSelectedImages } from "@/contexts/SelectedImagesContext";
import FileUploader from "./FileUploader";
import ImagePreview from "./ImagePreview";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useConversionOptions } from "@/contexts/ConversionOptionsContext";
import { formatOptions, type outputFormatOptions } from "@/types";
import { Slider } from "../ui/slider";

export default function ConvertTabContent(){

	const { selectedImages } = useSelectedImages()
	const { outputFormat, setOutputFormat, outputQuality, setOutputQuality } = useConversionOptions()

	const formatsThatCanChangeQuality = ["jpg", "jpeg"]

	function handleOutFormatChange(value: string){
		setOutputFormat(value as outputFormatOptions)

		if(!formatsThatCanChangeQuality.includes(value))
			setOutputQuality(100)
	}

	return (
		<div className=" grid grid-cols-1 gap-4 md:grid-cols-3">
			<div className=" flex flex-col gap-4 md:col-span-2">
				<FileUploader />
				{selectedImages.length > 0 && <ImagePreview />}
			</div>
			<div>
				<div className="flex flex-col gap-4 rounded-lg p-4 bg-background shadow">
					<span className=" text-lg font-medium">Conversion options</span>
					<Select 
						value={outputFormat} 
						onValueChange={handleOutFormatChange}
						disabled={selectedImages.length == 0}	
					>
						<label className="flex flex-col gap-1 text-sm">
							<span className="font-medium">Output format</span>
							<SelectTrigger className="w-full shadow-none">
								<SelectValue placeholder="Format" />
							</SelectTrigger>
						</label>
						<SelectContent>
							{formatOptions.map(format => <SelectItem key={format.label} value={format.value}>{format.label}</SelectItem>)}
						</SelectContent>
					</Select>
					<label className="flex flex-col gap-1 text-sm">
						<div className=" flex items-center justify-between">
							<span className="font-medium">Quality</span>
							<span>{`${outputQuality}%`}</span>
						</div>
						<Slider 
							max={100} 
							min={10}
							step={1}
							value={[outputQuality]}
							onValueChange={(v) => setOutputQuality(v[0])}
							disabled={selectedImages.length == 0 || !formatsThatCanChangeQuality.includes(outputFormat)}	
						/>
					</label>
				</div>
			</div>
		</div>
	)

}