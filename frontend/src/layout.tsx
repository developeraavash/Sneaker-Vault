import { Outlet } from "react-router-dom";
import Header from "./ui/header";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import { QueryClientProvider, QueryClient } from "react-query";
import { Toaster } from "sonner";
export default function Layout() {
  const client = new QueryClient();
  return (
    <div className="p-2">
      <Toaster />
      <Header />
      <Navbar />
      <main className="p-4">
        <QueryClientProvider client={client}>
          <Outlet />
        </QueryClientProvider>
      </main>
      <Footer />
    </div>
  );
}
