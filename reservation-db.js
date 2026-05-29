const MedallionReservationDB = (() => {
  const STORAGE_KEY = "medallionReservationDatabase";
  const LEGACY_BOOKING_KEY = "medallionLatestBooking";
  const TOTAL_SEATS = 676;
  const DEFAULT_RESERVED_SEATS = ["A4", "A5", "B8", "D12", "G6", "H7", "AA4", "X11"];

  function readDatabase() {
    try {
      const database = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (database && Array.isArray(database.reservations)) {
        return database;
      }
    } catch {
      // Fall through to a clean database if localStorage contains bad JSON.
    }

    return { reservations: [], updatedAt: new Date().toISOString() };
  }

  function writeDatabase(database) {
    database.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  }

  function normalizeSeat(seat) {
    return String(seat || "").trim().toUpperCase();
  }

  function normalizeSeats(seats) {
    return Array.from(new Set((seats || []).map(normalizeSeat).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }

  function samePerformance(reservation, performance) {
    return (
      reservation.movie === performance.movie &&
      reservation.date === performance.date &&
      reservation.time === performance.time
    );
  }

  function getReservedSeats(performance) {
    const database = readDatabase();
    const savedSeats = database.reservations
      .filter((reservation) => reservation.status !== "cancelled" && samePerformance(reservation, performance))
      .flatMap((reservation) => reservation.seats);

    return normalizeSeats([...DEFAULT_RESERVED_SEATS, ...savedSeats]);
  }

  function getSeatReport(performance) {
    const soldSeats = getReservedSeats(performance);
    return {
      soldSeats,
      availableSeats: Math.max(0, TOTAL_SEATS - soldSeats.length)
    };
  }

  function reserveSeats(booking) {
    const seats = normalizeSeats(booking.seats);
    const performance = {
      movie: booking.movie,
      date: booking.date,
      time: booking.time
    };
    const alreadyReserved = new Set(getReservedSeats(performance));
    const conflicts = seats.filter((seat) => alreadyReserved.has(seat));

    if (conflicts.length > 0) {
      return {
        ok: false,
        conflicts,
        ...getSeatReport(performance)
      };
    }

    const database = readDatabase();
    const reservation = {
      id: booking.id || `MED-${Date.now()}`,
      movie: booking.movie,
      date: booking.date,
      time: booking.time,
      seats,
      total: booking.total,
      paymentMethod: booking.paymentMethod || "Bank Transfer",
      status: booking.status || "reserved",
      customer: booking.customer || "",
      phone: booking.phone || "",
      email: booking.email || "",
      createdAt: new Date().toISOString()
    };

    database.reservations.push(reservation);
    writeDatabase(database);

    const report = getSeatReport(performance);
    const latestBooking = { ...reservation, ...report };
    localStorage.setItem(LEGACY_BOOKING_KEY, JSON.stringify(latestBooking));

    return {
      ok: true,
      booking: latestBooking,
      ...report
    };
  }

  function updateReservation(id, changes) {
    const database = readDatabase();
    const index = database.reservations.findIndex((reservation) => reservation.id === id);

    if (index === -1) {
      return null;
    }

    database.reservations[index] = {
      ...database.reservations[index],
      ...changes,
      updatedAt: new Date().toISOString()
    };
    writeDatabase(database);

    const reservation = database.reservations[index];
    const report = getSeatReport(reservation);
    const latestBooking = { ...reservation, ...report };
    localStorage.setItem(LEGACY_BOOKING_KEY, JSON.stringify(latestBooking));
    return latestBooking;
  }

  function getLatestBooking() {
    try {
      return JSON.parse(localStorage.getItem(LEGACY_BOOKING_KEY)) || null;
    } catch {
      return null;
    }
  }

  return {
    getLatestBooking,
    getReservedSeats,
    getSeatReport,
    normalizeSeats,
    reserveSeats,
    updateReservation
  };
})();
