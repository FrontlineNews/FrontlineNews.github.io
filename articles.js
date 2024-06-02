document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  // Function to format Unix timestamp to human-readable date string
  function formatDateTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Use 12-hour format
    };
    return date.toLocaleString(undefined, options);
  }

  // Function to display article content with new lines
  function formatArticleContent(content) {
    return content
      .split("\n")
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }

  // Function to create a slideshow of media items
  function createSlideshow(media) {
    const mediaContainer = document.getElementById("media-container");

    media.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      if (index === 0) slide.classList.add("active");

      if (item.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.src = "images/" + item;
        video.controls = true;
        slide.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = "images/" + item;
        img.alt = "Article Media";
        slide.appendChild(img);
      }

      mediaContainer.appendChild(slide);
    });

    // Add navigation buttons
    const prevButton = document.createElement("a");
    prevButton.className = "prev";
    prevButton.textContent = "❮";
    prevButton.onclick = () => changeSlide(-1);
    mediaContainer.appendChild(prevButton);

    const nextButton = document.createElement("a");
    nextButton.className = "next";
    nextButton.textContent = "❯";
    nextButton.onclick = () => changeSlide(1);
    mediaContainer.appendChild(nextButton);
  }

  // Function to change slide
  let currentSlide = 0;
  function changeSlide(n) {
    const slides = document.querySelectorAll(".slide");
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  // Load article with formatted date and time
  function loadArticle() {
    fetch("images/articles.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const article = data.find((item) => item.id == articleId);
        if (article) {
          document.getElementById("article-title").textContent = article.title;
          document.getElementById("article-info").textContent =
            `${formatDateTime(article.timestamp)} | ${article.author}`;

          const tagsContainer = document.getElementById("tags-container");
          article.tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.className = "tag";
            tagElement.textContent = tag;
            tagElement.addEventListener("click", () => {
              window.location.href = `index.html?tag=${tag}`;
            });
            tagsContainer.appendChild(tagElement);
          });

          createSlideshow(article.media);

          document.getElementById("article-content").innerHTML =
            formatArticleContent(article.content);
        } else {
          document.getElementById("article").innerHTML =
            "<p>Article not found.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching the articles:", error);
        document.getElementById("article").innerHTML =
          "<p>Error loading article.</p>";
      });
  }

  if (articleId) {
    loadArticle();
  }
});
