import Loader from "../../components/Loader/Loader";
import useClaim from "./useClaim";
import { ClaimPageImages } from "../../helpers/Images";

import "./Claim.scss";

export default function Claim() {
    const { isLoading, showError, restaurantData, claimed, claim } = useClaim();

    const externalLinks = [
        { label: "Website", url: restaurantData?.contact?.websiteUri },
        { label: "Google Maps", url: restaurantData?.contact?.googleMapsUri }
    ].filter(link => !!link.url);

    const features = [
        { label: "Outdoor Seating", value: restaurantData?.specialFeatures?.outdoorSeating },
        { label: "Caters", value: restaurantData?.specialFeatures?.caters },
        { label: "Good For Groups", value: restaurantData?.specialFeatures?.goodForGroups },
        { label: "Allows Dogs", value: restaurantData?.specialFeatures?.allowsDogs }
    ].filter(f => f.value);

    const ambienceLabels: string[] = [];
    const ambience = restaurantData?.ambience;

    if (ambience) {
        if (Array.isArray(ambience.ambience) && ambience.ambience.length)
            ambience.ambience.forEach((a: string) => ambienceLabels.push(a));
        if (Array.isArray(ambience.bestNights) && ambience.bestNights.length)
            ambienceLabels.push(`Best Nights: ${ambience.bestNights.join(", ")}`);
        if (Array.isArray(ambience.restaurantsAttire) && ambience.restaurantsAttire.length)
            ambienceLabels.push(`Attire: ${ambience.restaurantsAttire.join(", ")}`);
        if (ambience.noiseLevel)
            ambienceLabels.push(`Noise Level: ${ambience.noiseLevel}`);
        if (ambience.liveMusic)
            ambienceLabels.push("Live Music");
        if (ambience.happyHour)
            ambienceLabels.push("Happy Hour");
    }

    const address = [
        restaurantData?.coreInfo?.address?.address,
        restaurantData?.coreInfo?.address?.town,
        restaurantData?.coreInfo?.address?.city,
        restaurantData?.coreInfo?.address?.country
    ].filter(Boolean).join(", ");

    function renderPhotos() {
        return (
            <div className="photos">
                <img src={ClaimPageImages.Sample1} alt="restaurant" className="photo" />
                <img src={ClaimPageImages.Sample2} alt="restaurant" className="photo" />
                <img src={ClaimPageImages.Sample3} alt="restaurant" className="photo" />
                <img src={ClaimPageImages.Sample4} alt="restaurant" className="photo" />
                <img src={ClaimPageImages.Sample5} alt="restaurant" className="photo" />
            </div>
        );
    }

    function renderOpenHours() {
        const oh = restaurantData?.openHours;
        if (!oh) return null;
        return (
            <div className="hours-list">
                {Object.entries(oh).map(([day, times]: [string, string[]]) => (
                    <div key={day}>
                        <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>{" "}
                        <span>{(times && times.length > 0) ? times.join(", ") : "Closed"}</span>
                    </div>
                ))}
            </div>
        );
    }

    function ui() {
        if (isLoading) {
            return (
                <div className="claim-loader-container">
                    <Loader />
                </div>
            );
        }

        if (showError) {
            return (
                <div className="claim-error-container">
                    <img className="img" src={ClaimPageImages.Logo} alt="logo" />
                    <span>Restaurant Not Found</span>
                </div>
            );
        }

        if (claimed) {
            return (
                <div className="claim-error-container">
                    <img className="img" src={ClaimPageImages.Logo} alt="logo" />
                    <span>Restaurant Claimed</span>
                </div>
            );
        }

        return (
            <div className="claim-container">
                <div className="header">
                    <span className="name">{restaurantData?.coreInfo?.name}</span>
                    <span className="description">{restaurantData?.coreInfo?.description}</span>
                    <span className="location">{address}</span>
                    <div className="features">
                        {features.map(f => (
                            <span key={f.label} className="feature">{f.label}</span>
                        ))}
                        {ambienceLabels.map((label: string) => (
                            <span key={label} className="feature">{label}</span>
                        ))}
                    </div>
                    <span className="unclaimed">Unclaimed</span>
                </div>

                <div className="data-row">
                    {renderPhotos()}
                    <div className="info">
                        <div className="links">
                            {externalLinks.map(link => (
                                <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label}</a>
                            ))}
                            {restaurantData?.contact?.internationalPhoneNumber && (
                                <a href={`tel:${restaurantData.contact.internationalPhoneNumber}`}>Call</a>
                            )}
                            {!!restaurantData?.coreInfo?.menuUrl && (
                                <a href={restaurantData.coreInfo.menuUrl} target="_blank" rel="noopener noreferrer" className="menu-btn">
                                    View Menu
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hours">
                    <div className="heading">Opening Hours</div>
                    {renderOpenHours()}
                </div>

                <div className="reviews">
                    <div className="heading">What Diners Say</div>
                    <div className="review">{restaurantData?.summary?.reviewSummary}</div>
                </div>

                <button className="claim" onClick={() => { claim() }}>Claim</button>
            </div>
        );
    }

    return ui();
}
