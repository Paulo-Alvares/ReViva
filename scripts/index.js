// Espera o DOM ser totalmente carregado antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
  // 1. Seleciona os elementos do DOM
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenuIcon = document.getElementById("close-menu-icon");
  const menuLinks = document.querySelectorAll("#mobile-menu ul a");

  // 2. Função para abrir o menu
  function openMenu() {
    mobileMenu.classList.add("is-open");
  }

  // 3. Função para fechar o menu
  function closeMenu() {
    mobileMenu.classList.remove("is-open");
  }

  // 4. Adiciona os "escutadores" de evento (event listeners)
  hamburgerIcon.addEventListener("click", openMenu);
  closeMenuIcon.addEventListener("click", closeMenu);

  // 5. (Opcional, mas recomendado) Fecha o menu ao clicar em um link
  // Isso é útil para menus de página única (Single Page Application)
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});
