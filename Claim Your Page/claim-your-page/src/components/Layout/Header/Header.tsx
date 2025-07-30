import { HeaderImages } from "../../../helpers/Images";

import "./Header.scss";

export default function Header() {
    return (
        <div className="header-container">
            <img className="img" src={HeaderImages.Logo} alt="logo" />
        </div>
    )
}