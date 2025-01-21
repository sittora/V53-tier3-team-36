import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-layout-container">
      <Header />
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}
