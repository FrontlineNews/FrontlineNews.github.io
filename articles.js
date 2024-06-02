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

  // Function to add slideshow functionality
  function showSlides(slideIndex, mediaElements) {
    if (mediaElements.length > 1) {
      let slides = mediaElements;

      function showSlide(n) {
        slides.forEach((slide) => (slide.style.display = "none"));
        slides[n].style.display = "block";
      }

      let currentIndex = slideIndex;
      showSlide(currentIndex);

      document.querySelector(".prev").addEventListener("click", () => {
        currentIndex =
          currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        showSlide(currentIndex);
      });

      document.querySelector(".next").addEventListener("click", () => {
        currentIndex =
          currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        showSlide(currentIndex);
      });
    }
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

          const mediaContainer = document.getElementById("media-container");
          if (article.media && article.media.length > 0) {
            article.media.forEach((media) => {
              if (media.type === "video") {
                const video = document.createElement("video");
                video.src = "images/" + media.src;
                video.controls = true;
                video.className = "slide";
                mediaContainer.appendChild(video);
              } else if (media.type === "image") {
                const image = document.createElement("img");
                image.src = "images/" + media.src;
                image.alt = article.title;
                image.className = "slide";
                mediaContainer.appendChild(image);
              }
            });

            // Add navigation arrows if there is more than one media item
            if (article.media.length > 1) {
              const prev = document.createElement("a");
              prev.className = "prev";
              prev.innerHTML = "&#10094;";
              mediaContainer.appendChild(prev);

              const next = document.createElement("a");
              next.className = "next";
              next.innerHTML = "&#10095;";
              mediaContainer.appendChild(next);

              // Initialize slideshow
              const mediaElements = Array.from(
                mediaContainer.querySelectorAll(".slide"),
              );
              showSlides(0, mediaElements);
            } else {
              // Display the single media item
              mediaContainer.querySelector(".slide").style.display = "block";
            }
          }

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
