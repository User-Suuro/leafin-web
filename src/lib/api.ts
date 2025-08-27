export const fetchData = async <T>(
  url: string,
  setter: React.Dispatch<React.SetStateAction<T>>,
  token?: string
) => {
  try {
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setter(data);
  } catch {
    setter({} as T);
  }
};


export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = process.env.API_TCP_KEY;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  return response.json();
};



