document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tagFilter = urlParams.get("tag");

  const articlesContainer = document.getElementById("articles");
  const loadMoreButton = document.getElementById("load-more");
  let articlesData = [];
  let displayedArticles = 0;

  // Function to format Unix timestamp to "time ago" string
  function timeAgo(timestamp) {
    const now = new Date();
    const secondsPast = now.getTime() / 1000 - timestamp;

    if (secondsPast < 60) {
      return `${Math.round(secondsPast)}s ago`;
    } else if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)}m ago`;
    } else if (secondsPast < 86400) {
      return `${Math.round(secondsPast / 3600)}h ago`;
    } else {
      return `${Math.round(secondsPast / 86400)}d ago`;
    }
  }

  // Function to create and append article elements
  function displayArticles(articles) {
    articles.forEach((article) => {
      const articleElement = document.createElement("div");
      articleElement.className = "article";

      const titleElement = document.createElement("h2");
      titleElement.textContent = article.title;
      articleElement.appendChild(titleElement);

      const infoElement = document.createElement("p");
      infoElement.className = "article-info";
      infoElement.textContent = `${timeAgo(article.timestamp)} | ${article.author}`;
      articleElement.appendChild(infoElement);

      const tagsContainer = document.createElement("div");
      tagsContainer.className = "tags-container";
      article.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagElement.addEventListener("click", () => {
          window.location.href = `index.html?tag=${tag}`;
        });
        tagsContainer.appendChild(tagElement);
      });
      articleElement.appendChild(tagsContainer);

      if (article.media && article.media.length > 0) {
        const imgElement = document.createElement("img");
        imgElement.src = "images/" + article.media[0];
        imgElement.alt = article.title;
        articleElement.appendChild(imgElement);
      }

      articleElement.addEventListener("click", () => {
        window.location.href = `article.html?id=${article.id}`;
      });

      articlesContainer.appendChild(articleElement);
    });
  }

  // Load articles with optional tag filtering
  function loadArticles() {
    fetch("images/articles.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        articlesData = data;
        const filteredArticles = tagFilter
          ? articlesData.filter((article) => article.tags.includes(tagFilter))
          : articlesData;
        displayArticles(
          filteredArticles.slice(displayedArticles, displayedArticles + 10),
        );
        displayedArticles += 10;

        if (displayedArticles >= filteredArticles.length) {
          loadMoreButton.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }

  loadMoreButton.addEventListener("click", loadArticles);
  loadArticles();
});
