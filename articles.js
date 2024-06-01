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
          document.getElementById("article-content").innerHTML =
            article.content.replace(/\n/g, "<br>");

          const formattedDateTime = formatDateTime(article.timestamp);
          const articleInfo = `${formattedDateTime} | ${article.author}`;
          document.getElementById("article-info").textContent = articleInfo;

          const tagsContainer = document.getElementById("tags-container");
          article.tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.className = "tag";
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
          });

          const mediaContainer = document.getElementById("media-container");
          if (article.video) {
            const video = document.createElement("video");
            video.controls = true;
            const source = document.createElement("source");
            source.src = "videos/" + article.video;
            source.type = "video/mp4";
            video.appendChild(source);
            mediaContainer.appendChild(video);
          } else if (article.image) {
            const image = document.createElement("img");
            image.src = "images/" + article.image;
            image.alt = article.title;
            mediaContainer.appendChild(image);
          }
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
