import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
    return (
        <div>
            <main>{children}</main>
            <Toaster />
        </div>
    );
}
