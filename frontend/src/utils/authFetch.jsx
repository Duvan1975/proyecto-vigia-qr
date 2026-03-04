import Swal from "sweetalert2";

export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  return fetch(url, { ...options, headers }).then(async (res) => {

    if (res.status === 401 || res.status === 403) {

      await Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión ha caducado. Inicia sesión nuevamente.",
        confirmButtonText: "Ir a Login"
      });

      localStorage.removeItem("token");
      window.location.href = "/login";

      return; //cortar ejecución
    }

    return res;
  });
};