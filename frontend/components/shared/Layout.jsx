import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <main className="p-10">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;