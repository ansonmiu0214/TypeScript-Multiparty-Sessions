import { Credentials } from "./Models";

interface Quote {
  status: "available";
  quote: number;
};

interface Unavailable {
  status: "unavailable";
};

export type QueryResponse =
  | Quote
  | Unavailable
  ;
  

const initialSeatDB: [string, number][] = [
  ["London", 2],
  ["Edinburgh", 1],
  ["Tokyo", 0],
];
const SeatDatabase = new Map<string, number>(initialSeatDB);

const QuoteDatabase = new Map<string, number>([
  ["London", 50],
  ["Edinburgh", 100],
  ["Tokyo", 1000],
]);

const Reservations = new Map<string, string>([]);

export function resetBookings() {
  SeatDatabase.clear();
  initialSeatDB.forEach(([place, capacity]) => SeatDatabase.set(place, capacity));
  Reservations.clear();
}

async function delay<T>(result: T, milli: number = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result), milli);
  })
}

export function checkAvailability(sessionID: string, destination: string): Promise<QueryResponse> {
  const numberOfAvailableSeats = SeatDatabase.get(destination) ?? 0;
  if (numberOfAvailableSeats === 0) {
    return delay({ status: "unavailable" }, 1000);
  }

  // Temporarily reserve seat
  Reservations.set(sessionID, destination);
  SeatDatabase.set(destination, numberOfAvailableSeats - 1);

  const quote = QuoteDatabase.get(destination)!;
  return delay({
    status: "available",
    quote,
  }, 2000);
}

export function confirmBooking(sessionID: string, credentials: Credentials): Promise<void> {
  const destination = Reservations.get(sessionID)!;
  console.log(`${sessionID}: confirmed booking to ${destination}, 
               name=${credentials.name}, creditCard=${credentials.creditCard}`);
  return delay(undefined, 1000);
}

export function release(sessionID: string): Promise<void> {
  if (!tryRelease(sessionID)) {
    throw new Error(`Cannot release unknown booking for #${sessionID}`);
  }
  return delay(undefined, 2000);
}

export function tryRelease(sessionID: string): Promise<boolean> {
  const destination = Reservations.get(sessionID);
  if (destination !== undefined) {
    SeatDatabase.set(destination, (SeatDatabase.get(destination) ?? 0) + 1);
    console.log(`${sessionID}: release seat for ${destination}`);
    return delay(true, 1500);
  } else {
    // Did not reserve seat, do nothing
    return delay(false, 1000);
  }
}