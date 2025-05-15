import { Toaster } from '@/components/ui/sonner'
import { createRootRoute, Outlet} from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex flex-col min-w-96 min-h-screen bg-body">
				<Outlet />
				<Toaster
					toastOptions={{
						classNames: {
							toast: "!gap-3",
							success: "[&_svg]:size-6.5 [&_svg]:text-affirmative",
							error: "[&_svg]:size-6.5 [&_svg]:text-destructive"
						}
					}}
				/>
      </div>
    </>
  ),
})