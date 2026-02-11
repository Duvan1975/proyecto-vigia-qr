export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  return fetch(url, { ...options, headers }).then(async (res) => {
    if (res.status === 401 || res.status === 403) {
      // aquí puedes redirigir a login o mostrar Swal
      // Swal.fire("Sesión expirada", "Vuelve a iniciar sesión.", "warning");
      throw new Error("No autorizado");
    }
    return res;
  });
};

//Function para parsear JSON
export const authGet = (url) => {
  return authFetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Error HTTP: ${response.status}`);
  });
};