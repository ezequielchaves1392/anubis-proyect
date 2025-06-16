const STORAGE_KEY = "miAppData";

export function guardarDatos(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function cargarDatos() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : { users: [] };
}

export function agregarUsuario(user) {
  const datos = cargarDatos();
  datos.users.push(user);
  guardarDatos(datos);
}
