import ConvertTabContent from '@/components/ConvertTabContent'
import HistoryTabContent from '@/components/HistoryTabContent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConversionOptionsProvider } from '@/contexts/ConversionOptionsContext'
import { SelectedImagesProvider } from '@/contexts/SelectedImagesContext'
import { cn } from '@/lib/utils'
import { formatOptions, type outputFormatOptions } from '@/types'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { GetConvertedImages } from '@/../wailsjs/go/backend/ImageService'
import type { backend } from 'wailsjs/go/models'
import { ConvertedImagesProvider } from '@/contexts/ConvertedImagesContext'
import AppIcon from '@/components/branding/AppIcon'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {

	const [selectedTab, setSelectedTab] = useState<string>("convert")

	const [selectedImages, setSelectedImages] = useState<File[]>([])
	const [convertedImages, setConvertedImages] = useState<backend.ConvertedImage[]>([])

	const [outputFormat, setOutputFormat] = useState<outputFormatOptions>(formatOptions[0].value)
	const [outputQuality, setOutputQuality] = useState<number>(90)

	useEffect(() => {
		async function fetchConvertedImages() {
			try {
				const result = await GetConvertedImages()
				setConvertedImages(result ? result : [])
			} catch (error) {
				console.error(error)
			}	
		}

		fetchConvertedImages()
	}, [])
	
  return (
		<SelectedImagesProvider selectedImages={selectedImages} setSelectedImages={setSelectedImages}>
			<ConversionOptionsProvider 
				outputFormat={outputFormat} 
				setOutputFormat={setOutputFormat}
				outputQuality={outputQuality}
				setOutputQuality={setOutputQuality}
			>
				<ConvertedImagesProvider convertedImages={convertedImages} setConvertedImages={setConvertedImages}>
					<div className=" flex flex-col gap-4 mx-auto flex-1 p-4 max-w-(--breakpoint-xl) w-full">
						<div className=" flex gap-2 items-center">
							<AppIcon />
							<span className=" text-2xl font-bold">Image Converter</span>
						</div>
						<Tabs
							value={selectedTab}
							onValueChange={(v) => setSelectedTab(v)} 
							className=" flex flex-col flex-1"
						>
							<TabsList className=" mb-2 h-10">
								<TabsTrigger value="convert">Convert</TabsTrigger>
								<TabsTrigger value="history">History</TabsTrigger>
							</TabsList>
								<TabsContent 
									value="convert" 
									forceMount 
									className={cn(
										selectedTab != "convert" && "hidden"
									)}
								>
									<ConvertTabContent />
								</TabsContent>
								<TabsContent value="history">
									<HistoryTabContent />
								</TabsContent>
						</Tabs>
					</div>
				</ConvertedImagesProvider>
			</ConversionOptionsProvider>
		</SelectedImagesProvider>
  )
}