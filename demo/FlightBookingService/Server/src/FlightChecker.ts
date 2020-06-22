export type Available = 
  | { available: true, price: number }
  | { available: false };

export async function checkAvailable(dest: string) {
  const available = await db.availableSeats(dest);
  return new Promise<Available>((resolve, reject) => {
    setTimeout(() => {
      if (available) {
        resolve({
          available: true,
          price: 100,
        });
      } else {
        resolve({
          available: false,
        })
      }
    }, 1000);
  }) 
}

export async function cancelSeat(destination?: string) {
  if (destination)
    await db.cancelSeat(1000, destination);
  else
    await db.cancelSeat(0, 'London');
}

class SeatDatabase {

  private _destToSeat: Map<string, number>;

  constructor() {
    this._destToSeat = new Map([['London', 10]]);
  }

  async availableSeats(destination: string) {
    console.log(`SeatDB: processing enquiry for ${destination}`);
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        const seats = this._destToSeat.get(destination);
        if (seats !== undefined) {
          console.log(`SeatDB: seats to ${destination} availability: ${seats} -> ${seats - 1}`)
          this._destToSeat.set(destination, seats - 1);
        } else {
          console.log(`SeatDB: ${destination} is full`);
        }
        resolve(seats !== undefined);
      }, 2000);
    });
  }

  async cancelSeat(delay: number, destination: string) {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        const seats = this._destToSeat.get(destination) ?? 0;
        console.log(`SeatDB: seats to ${destination} availability: ${seats} -> ${seats + 1}`)
        this._destToSeat.set(destination, seats + 1);
        resolve(true);
      }, delay);
    });
  }
}

const db = new SeatDatabase();