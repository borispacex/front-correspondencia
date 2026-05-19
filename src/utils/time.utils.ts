export function formatTimeAgo(dateString: string) {
    const now = new Date().getTime();

    const date = new Date(dateString).getTime();

    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
        return "Hace unos segundos";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `Hace ${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    }

    const days = Math.floor(hours / 24);

    return `Hace ${days} día${days > 1 ? "s" : ""}`;
}