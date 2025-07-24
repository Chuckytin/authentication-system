import Header from "../components/Header";
import Menubar from "../components/Menubar";

const Home = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Menubar />
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1"
                style={{ marginBottom: '100px' }}>
                <Header />
            </div>
        </div>
    )
}

export default Home;