export function makeReservation(restaurant: string, datetime: string, adults: number, children: number) {
    return { success: true, message: `Reservation confirmed at ${restaurant} on ${datetime} for ${adults} adults and ${children} children` };
}