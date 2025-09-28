<template>
  <main class="inicio-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="text-content">
          <h1 class="titulo-principal animate-fade-in">
            Conecta, entrena, <span class="text-highlight">evoluciona</span>
          </h1>
          <p class="descripcion animate-fade-in-delay">
            La red social fitness donde crear, compartir y seguir rutinas de entrenamiento se convierte en una experiencia social.
          </p>
          <div class="botones animate-fade-in-delay-2">
            <router-link to="/inicio" class="btn btn-registro">
              Comenzar ahora
              <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </router-link>
            <router-link to="/login" class="btn btn-login">
              Iniciar Sesión
              <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </router-link>
          </div>
        </div>
        <div class="visual-content">
          <div class="floating-card card-1">
            <div class="card-content">
              <div class="avatar"></div>
              <p class="pr">¡Nuevo PR en press banca! 💪</p>
            </div>
          </div>
          <div class="floating-card card-2">
            <div class="card-content">
              <h4>Rutina de espalda</h4>
              <div class="exercise-list">
                <span>Dominadas 4x8</span>
                <span>Jalon al pecho 3x10</span>
                <span>Remo con barra 4x8</span>
              </div>
            </div>
          </div>
          <div class="floating-card card-3">
            <div class="stats">
              <div class="stat-item">
                <span class="stat-value">128</span>
                <span class="stat-label-2">Seguidores</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">42</span>
                <span class="stat-label-2">Rutinas</span>
              </div>
            </div>
          </div>
          <div class="hero-image">
            <div class="circle-background"></div>
          </div>
        </div>
      </div>
      <div class="scroll-indicator">
        <span>Desliza para descubrir</span>
        <div class="arrow"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Potencia tu <span class="text-highlight">entrenamiento</span></h2>
        <p class="section-subtitle">MoleroFit te ofrece las herramientas para maximizar tus resultados y conectar con una comunidad de fitness.</p>
        
        <div class="features-grid">
          <div class="feature-card" data-aos="fade-up">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                <path d="M4.462 19.462c.42-.419.753-.89.991-1.394a.75.75 0 10-1.357-.643c-.22.48-.491.924-.814 1.29a.75.75 0 101.18.946z" />
              </svg>
            </div>
            <h3>Crea Rutinas Personalizadas</h3>
            <p>Diseña planes de entrenamiento adaptados a tus objetivos y compártelos con la comunidad.</p>
          </div>
          
          <div class="feature-card feature-card-2" data-aos="fade-up" data-aos-delay="100">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
              </svg>
            </div>
            <h3>Conecta con Amigos</h3>
            <p>Sigue el progreso de tus amigos, comparte logros y motívense mutuamente.</p>
          </div>
          
          <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3>Descubre Entrenamientos</h3>
            <p>Explora rutinas creadas por expertos y encuentra la inspiración para tu próximo workout.</p>
          </div>
          
          <div class="feature-card feature-card-2" data-aos="fade-up" data-aos-delay="300">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
            </div>
            <h3>Monitorea tu Progreso</h3>
            <p>Registra tus entrenamientos, visualiza estadísticas y celebra tus mejoras.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat" data-aos="zoom-in">
            <span class="stat-number" data-count="50000">0</span>
            <span class="stat-label">Usuarios activos</span>
          </div>
          <div class="stat" data-aos="zoom-in" data-aos-delay="100">
            <span class="stat-number" data-count="120000">0</span>
            <span class="stat-label">Rutinas creadas</span>
          </div>
          <div class="stat" data-aos="zoom-in" data-aos-delay="200">
            <span class="stat-number" data-count="35">0</span>
            <span class="stat-label">Países</span>
          </div>
          <div class="stat" data-aos="zoom-in" data-aos-delay="300">
            <span class="stat-number" data-count="98">0</span>
            <span class="stat-label">% Satisfacción</span>
          </div>
        </div>
      </div>
    </section>

    <!-- App Download Section -->
    <section class="app-section">
      <div class="container">
        <div class="app-content">
          <div class="app-text" data-aos="fade-right">
            <h2>Descarga nuestra app móvil</h2>
            <p>Lleva tu experiencia fitness al siguiente nivel con nuestra aplicación móvil. Accede a todas las funciones de GymConnect desde tu teléfono.</p>
            <ul class="app-features">
              <li>Rutinas personalizadas en tu bolsillo</li>
              <li>Seguimiento de progreso en tiempo real</li>
              <li>Notificaciones de entrenamiento</li>
              <li>Conexión con la comunidad al instante</li>
            </ul>
            <a href="https://drive.google.com/file/d/1STJENgoGEC2lvukltMyUcRrNvZx06_qG/view?usp=sharing" class="btn btn-download" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Descargar APK
            </a>
            <p class="download-note">Versión 1.0 - Android 5.0+</p>
          </div>
          <div class="app-visual" data-aos="fade-left">
            <div class="phone-mockup">
              <div class="phone-screen">
                <div class="app-preview">
                  <div class="app-header">
                    <div class="app-avatar"></div>
                    <div class="app-user-info">
                      <div class="app-username">Usuario</div>
                      <div class="app-status">Activo ahora</div>
                    </div>
                  </div>
                  <div class="app-content-preview">
                    <div class="workout-card">
                      <div class="workout-title">Rutina de hoy</div>
                      <div class="workout-exercises">
                        <span>Press banca 4x8</span>
                        <span>Sentadillas 4x10</span>
                        <span>Dominadas 3xMAX</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content" data-aos="fade-up">
          <h2>Únete a la comunidad fitness más activa</h2>
          <p>Regístrate hoy y comienza a transformar tu forma de entrenar</p>
          <router-link to="/register" class="btn btn-cta">
            Crear cuenta gratuita
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "InicioPage",
  mounted() {
    // Animación para los contadores de estadísticas
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const inc = target / speed;
            
            if (count < target) {
              counter.innerText = Math.ceil(count + inc);
              setTimeout(() => {
                // Continúa animando hasta llegar al objetivo
                const updateCount = () => {
                  const count = +counter.innerText;
                  const inc = target / speed;
                  
                  if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                  } else {
                    counter.innerText = target;
                  }
                };
                updateCount();
              }, 1);
            } else {
              counter.innerText = target;
            }
          });
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
};
</script>

<style scoped>

/* Contenedor principal */
.inicio-container {
  font-family: 'Inter', 'Poppins', sans-serif;
  color: var(--color-quinto);
  overflow-x: hidden;
  padding: 0;
}

/* Hero Section */
.hero-section {
  height: 94dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 2rem;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 0 4rem;
  flex: 1;
}

.text-content {
  flex: 1;
  max-width: 550px;
  z-index: 2;
}

.titulo-principal {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--color-quinto);
}

.text-highlight {
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.descripcion {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  color: var(--color-sexto);
}

.botones {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  border: none;
  justify-content: space-between;
  cursor: pointer;
}

.btn-registro {
  background: linear-gradient(90deg, var(--color-primary), var(--color-cuarto));
  color: var(--color-secondary);
  box-shadow: var(--shadow);
  min-width: 159px;
}

.btn-login {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  min-width: 159px;
}

.btn-cta {
  background: linear-gradient(90deg, var(--color-accent), #ff4da6);
  color: var(--color-secondary);
  box-shadow: var(--shadow);
  margin-top: 1.5rem;
}

.btn-download {
  background: linear-gradient(90deg, #10b981, #059669);
  color: var(--color-secondary);
  box-shadow: var(--shadow);
  margin-top: 1.5rem;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
}

.visual-content {
  flex: 1;
  position: relative;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  position: relative;
  width: 380px;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-background {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-cuarto) 100%);
  opacity: 0.8;
  position: absolute;
}

.floating-card {
  position: absolute;
  background: var(--color-secondary);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
  z-index: 3;
  width: 220px;
}

.card-1 {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.card-2 {
  bottom: 60px;
  right: 0;
  animation-delay: 2s;
}

.card-3 {
  top: 50%;
  right: 80px;
  animation-delay: 4s;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--color-accent), #ff7ab8);
  margin-bottom: 0.75rem;
}
.pr{
  font-weight: 600;
  color: var(--color-quinto);
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.exercise-list span {
  font-size: 0.85rem;
  padding: 0.35rem 0.5rem;
  background: var(--color-secondary);
  border-radius: 6px;
}

.stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-quinto);
}

.scroll-indicator {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-sexto);
  font-size: 0.9rem;
}

.arrow {
  width: 2px;
  height: 30px;
  background: var(--color-sexto);
  margin-top: 0.5rem;
  position: relative;
}

.arrow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -4px;
  width: 10px;
  height: 10px;
  border-right: 2px solid var(--color-sexto);
  border-bottom: 2px solid var(--color-sexto);
  transform: rotate(45deg);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Features Section */
.features-section {
  padding: 8rem 2rem 0;
  background: var(--color-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--color-quinto);
}

.section-subtitle {
  font-size: 1.1rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  color: var(--color-sexto);
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 6rem;
  place-self: anchor-center;
}

.feature-card {
  background: var(--color-secondary);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  text-align: center;
  transition: 0.5s;
  filter:drop-shadow(1px -1px 0px var(--color-primary));
  transform: rotateZ(10deg);
  
}
.feature-card-2{
  transform: rotateZ(-10deg);
  filter:drop-shadow(-1px -1px 0px var(--color-primary));
}

.feature-card:hover {
  transform: scale(1.05) rotateZ(0deg);
  z-index: 10;
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-terciario) 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.feature-icon svg {
  width: 32px;
  height: 32px;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-quinto);
}

.feature-card p {
  color: var(--color-sexto);
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-cuarto) 100%);
  color: var(--color-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 0 auto;
}

.stat {
  text-align: center;
  padding: 1.5rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
  color: var(--color-secondary);
}
.stat-label-2 {
  font-size: 1.1rem;
  opacity: 0.9;
  color: var(--color-quinto);
}

/* App Download Section */
.app-section {
  padding: 8rem 2rem;
  background: var(--color-secondary);
}

.app-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

.app-text {
  flex: 1;
  max-width: 500px;
}

.app-text h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--color-quinto);
}

.app-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: var(--color-sexto);
}

.app-features {
  list-style: none;
  margin-bottom: 2.5rem;
}

.app-features li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1rem;
  color: var(--color-quinto);
}

.app-features li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

.download-note {
  font-size: 0.9rem;
  color: var(--color-sexto);
  margin-top: 0.5rem;
}

.app-visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.phone-mockup {
  width: 300px;
  height: 600px;
  background: var(--color-quinto);
  border-radius: 40px;
  padding: 15px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: var(--color-secondary);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
}

.app-preview {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.app-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--color-primary), var(--color-cuarto));
  margin-right: 15px;
}

.app-user-info {
  flex: 1;
}

.app-username {
  font-weight: 700;
  color: var(--color-quinto);
  margin-bottom: 5px;
}

.app-status {
  font-size: 0.9rem;
  color: var(--color-primary);
}

.workout-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-cuarto) 100%);
  border-radius: 16px;
  padding: 20px;
  color: var(--color-secondary);
}

.workout-title {
  font-weight: 700;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.workout-exercises {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.workout-exercises span {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  padding: 8rem 2rem;
  background: var(--color-terciario);
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--color-quinto);
}

.cta-content p {
  font-size: 1.2rem;
  color: var(--color-sexto);
  margin-bottom: 2rem;
}

/* Animaciones */
.animate-fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.8s ease forwards;
}

.animate-fade-in-delay {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.8s ease 0.3s forwards;
}

.animate-fade-in-delay-2 {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.8s ease 0.6s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 988px) {
  .hero-section{
    height: 92dvh;
  }
  .stats-grid{
  grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
  }
  .hero-content {
    flex-direction: column;
    text-align: center;
    padding-top: 2rem;
  }
  .scroll-indicator[data-v-c549cbd6]{
  position: absolute;
  bottom: 1rem;
  }
  
  .botones{
    justify-content: center;
    margin-bottom: 4rem;
  }
  .card-3{
  top: 20%;
  }
  
  .titulo-principal {
    font-size: 2.5rem;
  }
  
  .visual-content {
    width: 100%;
    height: 400px;
  }
  
  .floating-card {
    transform: scale(0.9);
  }
  
  .app-content {
    flex-direction: column;
    text-align: center;
  }
  
  .app-text {
    max-width: 100%;
  }
  
  .app-features li {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .botones {
    flex-direction: column;
    align-items: center;
  }
  
  .titulo-principal {
    font-size: 2rem;
  }
  
  .descripcion {
    font-size: 1.1rem;
  }
  
  .floating-card {
    display: none;
  }
  
  .hero-image {
    width: 280px;
    height: 280px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .phone-mockup {
    width: 250px;
    height: 500px;
  }
  
  .app-text h2 {
    font-size: 2rem;
  }
}
</style>