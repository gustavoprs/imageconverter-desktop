import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

type AppIconProps = {
	className?: string
	size?: number
}

export default function AppIcon({ className, size = 32 }: AppIconProps){

	return (
		<div 
			className={cn(
				"flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white",
				className,
			)}
			style={{ borderRadius: "20%", width: size, height: size }}
		>
			<ImageIcon className=" size-2/3" />
		</div>
	)

}