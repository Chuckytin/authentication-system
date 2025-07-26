import Header from "../components/Header";
import Menubar from "../components/Menubar";

const Home = () => {
    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: "#f8f9fa" }}>
            <Menubar />

            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5">
                <Header />
            </div>

            {/* Efecto de onda en la parte inferior */}
            <div style={{
                height: "100px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                clipPath: "ellipse(100% 100% at 50% 100%)"
            }}></div>
        </div>
    )
}

export default Home;