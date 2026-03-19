import { Outlet } from "react-router-dom";

import Header from "../../widgets/Header.tsx";
import Footer from "../../widgets/Footer.tsx";

export const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}