import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { DeleteAllConvertedImages } from "@/../wailsjs/go/backend/ImageService";
import { useConvertedImages } from "@/contexts/ConvertedImagesContext";
import { toast } from "sonner";

export default function ClearHistoryAlertDialog(){

	const { setConvertedImages } = useConvertedImages()

	async function handleClearHistory() {
  try {
    await DeleteAllConvertedImages()
    setConvertedImages([])
    toast.success("Image history cleared successfully")
  } catch (error) {
    console.error(error)
    toast.error("Failed to clear image history")
  }
}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					size="sm"
					variant="outline"
					className="border-destructive/25 text-destructive shadow-none hover:bg-destructive/5 hover:text-destructive"
				>
					<Trash2Icon />
					Remove all
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete all history and the images will no longer be recoverable.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="shadow-none">Cancel</AlertDialogCancel>
					<Button 
						variant="destructive"
						onClick={handleClearHistory} 
						asChild
					>
						<AlertDialogAction>Continue</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)

}