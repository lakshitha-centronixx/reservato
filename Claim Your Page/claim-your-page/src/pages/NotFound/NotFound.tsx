import { NotFoundImages } from "../../helpers/Images";

import "./NotFound.scss";

export default function NotFound() {
    return (
        <div className="not-found-container">
            <img className="img" src={NotFoundImages.Logo} alt="logo" />
            <span>Page Not Found</span>
        </div>
    )
}