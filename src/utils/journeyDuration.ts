export function journeyDuration(
  departureDate: string,
  departureTime: string,
  arrivalDate: string,
  arrivalTime: string
): string {
  try {
    const start = new Date(`${departureDate}T${departureTime}`);
    const end = new Date(`${arrivalDate}T${arrivalTime}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date");
    }

    const durationMs = end.getTime() - start.getTime();
    if (durationMs <= 0) return "-";

    const totalMinutes = Math.floor(durationMs / 60000);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(" ");
  } catch {
    return "Failed to calculate journey duration";
  }
}
