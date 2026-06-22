const navMenuButton = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector(".mobile-nav")
const icon = document.querySelector(".open-close-btn")
const wholeNav = document.querySelector("#nav")

navMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");

    icon.src = mobileMenu.classList.contains("open")
    ? "/icons/close.svg"
    : "/icons/menu.svg";
});



document.addEventListener("click", (e) => {
  const clickedInsideNav = wholeNav.contains(e.target);
  const clickedMenuBtn = navMenuButton.contains(e.target);

  if (
    mobileMenu.classList.contains("open") &&
    !clickedInsideNav &&
    !clickedMenuBtn
  ) {
    mobileMenu.classList.remove("open");
    icon.src = "/icons/menu.svg";
  }
});



const faqItem = document.querySelectorAll(".faq-item");

faqItem.forEach(item => {
  const question = item.querySelector(".topper");
  const answer = item.querySelector(".answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    faqItem.forEach(faq => {
      faq.classList.remove("active");
      faq.querySelector(".answer").style.marginTop = 0;
      faq.querySelector(".answer").style.opacity = 0;
      faq.querySelector(".answer").style.maxHeight = 0;
      faq.style.backgroundColor = "#000";

    });

    if (!isOpen) {
      item.classList.add("active");
      answer.style.maxHeight = "300px";
      answer.style.marginTop = "12px";
      answer.style.opacity = "1";
      item.style.backgroundColor = "#0a0a0a";
    }
  });
});