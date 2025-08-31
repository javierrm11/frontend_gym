export const updateLogro = async (idLogro, idUsuario) => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/api/usuarioLogros`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_logro: idLogro,
          id_usuario: idUsuario,
        }),
      }
    );
    if (!response.ok) throw new Error("Error al actualizar el logro");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarLogro = async (idLogro, idUsuario) => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/api/usuarioLogros`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_logro: idLogro,
          id_usuario: idUsuario,
        }),
      }
    );
    if (!response.ok) throw new Error("Error al eliminar el logro");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
