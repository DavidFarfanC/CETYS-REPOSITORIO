const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error ${response.status} al consultar ${path}`);
  }

  return response.json();
}

export async function fetchProfessors({ signal } = {}) {
  return request('/profesores', { signal });
}

export async function fetchProfessorById(id, { signal } = {}) {
  if (!id) {
    throw new Error('El identificador del profesor es requerido');
  }
  return request(`/profesores/${id}`, { signal });
}
