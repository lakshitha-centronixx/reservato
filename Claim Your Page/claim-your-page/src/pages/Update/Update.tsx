import Loader from "../../components/Loader/Loader";
import { ClaimPageImages } from "../../helpers/Images";
import useUpdate from "./useUpdate";

import "./Update.scss";

export default function Update() {
    const { isLoading, showError, restaurantData, claimed, setEmail, update } = useUpdate();

    const externalLinks = [
        { label: "Website", url: restaurantData?.contact?.websiteUri },
        { label: "Google Maps", url: restaurantData?.contact?.googleMapsUri }
    ].filter(link => !!link.url);

    const address = [
        restaurantData?.coreInfo?.address?.address,
        restaurantData?.coreInfo?.address?.town,
        restaurantData?.coreInfo?.address?.city,
        restaurantData?.coreInfo?.address?.country
    ].filter(Boolean).join(", ");

    function ui() {
        if (isLoading) {
            return (
                <div className="update-loader-container">
                    <Loader />
                </div>
            );
        }

        if (showError) {
            return (
                <div className="update-error-container">
                    <img className="img" src={ClaimPageImages.Logo} alt="logo" />
                    <span>Restaurant Not Found</span>
                </div>
            );
        }

        if (claimed) {
            return (
                <div className="update-error-container">
                    <img className="img" src={ClaimPageImages.Logo} alt="logo" />
                    <span>Restaurant Claimed</span>
                </div>
            );
        }

        return (
            <div className="update-container">
                <div className="header">
                    <span className="name">{restaurantData?.coreInfo?.name}</span>
                    <span className="description">{restaurantData?.coreInfo?.description}</span>
                    <span className="location">{address}</span>
                </div>

                <div className="data-row">
                    <div className="links">
                        {externalLinks.map(link => (
                            <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label}</a>
                        ))}
                    </div>
                </div>

                <input type="email" placeholder="Email Address" onChange={(e) => { setEmail(e.target.value) }} />

                <button className="claim" onClick={() => { update() }}>Update</button>
            </div>
        );
    }

    return ui();
}
