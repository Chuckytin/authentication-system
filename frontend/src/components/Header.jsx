import { assets } from "../assets/assets";

const Header = () => {
    return (
        <div className="text-center px-3" style={{ maxWidth: "600px" }}>
            <img src={assets.header} alt="header" width={120} className="mb-4"/>
            <h5 className="fw-semibold">
                Hi Developer <span role="img" aria-label="wave">👋</span>
            </h5>
            <h1 className="fw-bold display-5 mb-3">Welcome to Authify</h1>
            
            <p className="text-muted fs-5 mb-4">
                Setup authentication in minutes with our easy-to-use solution
            </p>

            <button className="btn btn-outline-dark rounded-pill px-4 py-2">
                Get started
            </button>
        </div>
    )
}

export default Header;