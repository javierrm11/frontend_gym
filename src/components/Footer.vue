<template>
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-logo">
          <h1>Gym</h1>
        </div>
        <nav class="footer-nav">
          <ul>
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/entrenamiento">Rutinas</router-link></li>
            <li><router-link to="/profile">Perfil</router-link></li>
          </ul>
        </nav>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2023 Gym.</p>
      </div>
    </footer>
</template>

<script>
export default {
  name: "FooterList",
};
</script>

<style scoped>
.footer {
  background-color: var(--color-secondary);
  color: var(--color-quinto);
  padding: 2rem 1rem 1rem;
  text-align: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;

}

.footer-logo h1 {
  font-size: 1.8rem;
  color: var(--color-primary);
  font-weight: bold;
  margin: 0;
}

.footer-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
    justify-content: center;
  gap: 1.5rem;
}

.footer-nav ul li a {
  text-decoration: none;
  font-size: 1.2rem;
  color: var(--color-quinto);
  font-weight: 500;
  transition: color var(--transition-speed);
}

.footer-nav ul li a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.footer-bottom {
  font-size: 0.8rem;
  color: var(--color-sexto);
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }

  .footer-nav ul {
    gap: 0.8rem;
    margin-top: 1rem;
  }
}
</style>
