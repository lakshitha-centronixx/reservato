import React, { useEffect, useState } from "react";
import "./Edit.scss";
import type { IRestaurantData } from "../../helpers/interfaces/IRestaurant";
import ApiService from "../../services/ApiService";
import { useParams } from "react-router-dom";

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

const weekDays: WeekDay[] = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

export const Edit: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(false);
    const [data, setData] = useState<IRestaurantData | null>(null);
    const { id } = useParams<{ id: string }>();
    const apiService = new ApiService();

    useEffect(() => {
        if (id) {
            fetchRestaurantData(id);
        }
    }, [id]);

    async function fetchRestaurantData(id: string) {
        setIsLoading(true);
        setShowError(false);
        try {
            const response = await apiService.getData(id);
            let remote = response.data?.data;
            if (!remote) {
                setShowError(true);
                setData(null);
                return;
            }
            setData((remote?.data));
        } catch {
            setShowError(true);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }

    // Helper to update nested state
    const update = (path: (string | number)[], value: any) => {
        setData(prev => {
            if (!prev) return prev;
            let temp: any = { ...prev };
            let obj = temp;
            for (let i = 0; i < path.length - 1; i++) {
                obj[path[i]] = { ...obj[path[i]] };
                obj = obj[path[i]];
            }
            obj[path[path.length - 1]] = value;
            return { ...temp };
        });
    };

    // Categories
    const handleCategoryChange = (idx: number, val: string) => {
        if (!data) return;
        const cats = [...data.coreInfo.categories];
        cats[idx] = val;
        update(["coreInfo", "categories"], cats);
    };
    const handleAddCategory = () => {
        if (!data) return;
        update(["coreInfo", "categories"], [...data.coreInfo.categories, ""]);
    };
    const handleRemoveCategory = (idx: number) => {
        if (!data) return;
        const cats = data.coreInfo.categories.filter((_, i) => i !== idx);
        update(["coreInfo", "categories"], cats);
    };

    // Opening Hours
    const handleHourChange = (day: WeekDay, idx: number, val: string) => {
        if (!data) return;
        const newHours = [...data.openHours[day]];
        newHours[idx] = val;
        update(["openHours", day], newHours);
    };
    const handleAddHour = (day: WeekDay) => {
        if (!data) return;
        update(["openHours", day], [...data.openHours[day], ""]);
    };
    const handleRemoveHour = (day: WeekDay, idx: number) => {
        if (!data) return;
        update(["openHours", day], data.openHours[day].filter((_, i) => i !== idx));
    };

    // Save Handler
    const handleSave = () => {
        if (!data) return;
        alert("Data saved:\n" + JSON.stringify(data, null, 2));
    };

    if (isLoading) {
        return <div className="restaurantEditor"><h2>Loading…</h2></div>;
    }
    if (showError || !data) {
        return (
            <div className="restaurantEditor">
                <h2>Error</h2>
                <p>Restaurant data could not be loaded.</p>
            </div>
        );
    }

    return (
        <form className="restaurantEditor"
            onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <h2>Edit Restaurant Information</h2>

            {/* Core Info */}
            <fieldset>
                <legend>Core Info</legend>
                <label>Name</label>
                <input
                    type="text"
                    value={data.coreInfo.name}
                    onChange={e => update(["coreInfo", "name"], e.target.value)}
                />

                <label>Description</label>
                <textarea
                    value={data.coreInfo.description}
                    onChange={e => update(["coreInfo", "description"], e.target.value)}
                />

                <label>Categories</label>
                {data.coreInfo.categories.map((cat, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                            type="text"
                            value={cat}
                            onChange={e => handleCategoryChange(idx, e.target.value)}
                        />
                        <button type="button" onClick={() => handleRemoveCategory(idx)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddCategory}>Add Category</button>

                <label>Menu URL</label>
                <input
                    type="text"
                    value={data.coreInfo.menuUrl}
                    onChange={e => update(["coreInfo", "menuUrl"], e.target.value)}
                />

                <label>Price Level</label>
                <input
                    type="text"
                    value={data.coreInfo.priceLevel}
                    onChange={e => update(["coreInfo", "priceLevel"], e.target.value)}
                />

                <label>Address</label>
                <input
                    type="text"
                    placeholder="Street"
                    value={data.coreInfo.address.address}
                    onChange={e => update(["coreInfo", "address", "address"], e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Town"
                    value={data.coreInfo.address.town}
                    onChange={e => update(["coreInfo", "address", "town"], e.target.value)}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={data.coreInfo.address.city}
                    onChange={e => update(["coreInfo", "address", "city"], e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={data.coreInfo.address.country}
                    onChange={e => update(["coreInfo", "address", "country"], e.target.value)}
                />
            </fieldset>

            {/* Location */}
            <fieldset>
                <legend>Location</legend>
                <label>Latitude</label>
                <input
                    type="text"
                    value={data.location.latitude}
                    onChange={e => update(["location", "latitude"], e.target.value)}
                />
                <label>Longitude</label>
                <input
                    type="text"
                    value={data.location.longitude}
                    onChange={e => update(["location", "longitude"], e.target.value)}
                />
            </fieldset>

            {/* Contact */}
            <fieldset>
                <legend>Contact</legend>
                <label>Phone</label>
                <input
                    type="text"
                    value={data.contact.internationalPhoneNumber}
                    onChange={e => update(["contact", "internationalPhoneNumber"], e.target.value)}
                />
                <label>Website</label>
                <input
                    type="text"
                    value={data.contact.websiteUri}
                    onChange={e => update(["contact", "websiteUri"], e.target.value)}
                />
                <label>Email</label>
                <input
                    type="email"
                    value={data.contact.email}
                    onChange={e => update(["contact", "email"], e.target.value)}
                />
                <label>Google Maps Link</label>
                <input
                    type="text"
                    value={data.contact.googleMapsUri}
                    onChange={e => update(["contact", "googleMapsUri"], e.target.value)}
                />
            </fieldset>

            {/* Payments */}
            <fieldset>
                <legend>Payments</legend>
                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={data.payments.acceptsCreditCards}
                            onChange={e => update(["payments", "acceptsCreditCards"], e.target.checked)}
                        />
                        Credit Cards
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={data.payments.acceptsDebitCards}
                            onChange={e => update(["payments", "acceptsDebitCards"], e.target.checked)}
                        />
                        Debit Cards
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={data.payments.acceptsCashOnly}
                            onChange={e => update(["payments", "acceptsCashOnly"], e.target.checked)}
                        />
                        Cash Only
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={data.payments.acceptsNfc}
                            onChange={e => update(["payments", "acceptsNfc"], e.target.checked)}
                        />
                        NFC
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={data.payments.businessAcceptsApplePay}
                            onChange={e => update(["payments", "businessAcceptsApplePay"], e.target.checked)}
                        />
                        Apple Pay
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={data.payments.businessAcceptsAndroidPay}
                            onChange={e => update(["payments", "businessAcceptsAndroidPay"], e.target.checked)}
                        />
                        Android Pay
                    </label>
                </div>
            </fieldset>

            {/* Opening Hours */}
            <fieldset>
                <legend>Opening Hours</legend>
                {weekDays.map(day => (
                    <div key={day} style={{ marginBottom: "1.2rem" }}>
                        <label style={{ textTransform: "capitalize" }}>{day}</label>
                        {data.openHours[day].map((slot, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <input
                                    type="text"
                                    value={slot}
                                    placeholder="e.g. 08:00-15:00"
                                    onChange={e => handleHourChange(day, idx, e.target.value)}
                                />
                                <button type="button" onClick={() => handleRemoveHour(day, idx)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddHour(day)}>
                            Add Slot
                        </button>
                    </div>
                ))}
            </fieldset>

            <div className="actions">
                <button type="submit">Save</button>
            </div>
        </form>
    );
};
