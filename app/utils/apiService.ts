export interface ServiceItem {
    id: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    slug: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    services: ServiceItem[];
}

export interface BackendData {
    doctors: any[];
    services: ServiceCategory[];
}

// Универсальная функция получения данных с нашего "бэкенда"
export async function fetchFromBackend(): Promise<BackendData> {
    const response = await fetch('/api/data.json');
    if (!response.ok) {
        throw new Error('Не удалось загрузить данные с сервера клиники');
    }
    return response.json();
}