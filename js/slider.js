document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentIndex = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      dotsContainer.children[i].classList.remove("active");
    });
    slides[index].classList.add("active");
    dotsContainer.children[index].classList.add("active");
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startAutoSlide() {
    interval = setInterval(nextSlide, 2000);
  }

  function createDots() {
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => {
        currentIndex = i;
        showSlide(currentIndex);
      });
      dotsContainer.appendChild(dot);
    });
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  createDots();
  showSlide(currentIndex);
  startAutoSlide();
});
