import { createRootRoute, Outlet} from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex flex-col min-w-96 min-h-screen bg-body">
				<Outlet />
      </div>
    </>
  ),
})