import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectPending } from '@/state/wsconnection/wsConnectionSlice'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/ui/app-sidebar'
import { Outlet } from 'react-router'
import { Toaster } from './components/ui/sonner'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(connectPending())
    }, [dispatch])

    return (
        <div className="app-container">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Outlet />
                </SidebarInset>
            </SidebarProvider>
            <Toaster />
        </div>
    )
}

export default App
