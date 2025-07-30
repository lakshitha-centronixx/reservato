import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { toast } from "react-toastify";
import type { IRestaurantData } from "../../helpers/interfaces/IRestaurant";
import { isValidEmail } from "../../helpers/validators";

const useUpdate = () => {

    const { id } = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [info, setInfo] = useState<{ "data": IRestaurantData, claimed: boolean } | null>(null);

    useEffect(() => {
        if (id) {
            fetchRestaurantData(id)
        }
    }, [id])

    const apiService = new ApiService();

    async function fetchRestaurantData(id: string) {
        setIsLoading(true);

        await apiService.getData(id).then((response) => {
            let data = response.data?.data;

            if (data == null) {
                setShowError(true);
                return;
            }

            setInfo({ data: data?.data, claimed: data?.claimed });
        }).catch((_) => {
            setShowError(true);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    async function update() {
        if (id && email) {

            if (!isValidEmail(email)) {
                toast.error('Invalid Email Address!');
                return;
            }

            setIsLoading(true);

            await apiService.update(id, email).then((_) => {
                toast.success('Updated!');
                window.location.href = 'https://reservato.ai/';
            }).catch((_) => {
                toast.error('Failed');
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }

    return {
        isLoading,
        showError,
        restaurantData: info?.data,
        claimed: info?.claimed,
        setEmail,
        update
    };
}

export default useUpdate;