import { ClipLoader } from "react-spinners";
import { LoaderImages } from "../../helpers/Images";

import "./Loader.scss";

export default function Loader() {
    return (
        <div className="loader-container">
            <img className="img" src={LoaderImages.Logo} alt="logo" />
            <ClipLoader color="white" size={50} aria-label="Loading Spinner" data-testid="loader" />
        </div>
    )
}