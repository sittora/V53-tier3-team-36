import "./pageLayout.scss";
import Footer from '../Footer/footer';
import Header from '../Header/header';

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
