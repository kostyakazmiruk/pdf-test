"use client"
import "./globals.css";
import {QueryClient, QueryClientProvider} from "react-query";
import Sidebar from "./_components/SideBar";

const queryClient = new QueryClient()
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
            <div className="flex w-full">
                <div className="w-1/5 bg-gray-800 text-white p-4">
                    <Sidebar/>
                </div>
                <div className="w-4/5">{children}</div>
            </div>
        </QueryClientProvider>
        </body>
        </html>
    );
}
