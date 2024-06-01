document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  // Function to format Unix timestamp to human-readable date string
  function formatDateTime(timestamp) {
      const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
      const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true // Use 12-hour format
      };
      return date.toLocaleString(undefined, options);
  }

  // Load article with formatted date and time
  function loadArticle() {
      fetch('images/articles.json')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              const article = data.find(item => item.id == articleId);
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
                  if (article.video) {
                    const video = document.createElement("video");
                    video.src = "images/" + article.video;
                    video.controls = true;
                    mediaContainer.appendChild(video);
                  } else if (article.image) {
                    const image = document.createElement("img");
                    image.src = "images/" + article.image;
                    image.alt = article.title;
                    mediaContainer.appendChild(image);
                  }
            
                  document.getElementById("article-content").innerHTML =
                    formatArticleContent(article.content);
          
              } else {
                  document.getElementById('article').innerHTML = '<p>Article not found.</p>';
              }
          })
          .catch(error => {
              console.error('Error fetching the articles:', error);
              document.getElementById('article').innerHTML = '<p>Error loading article.</p>';
          });
  }

  if (articleId) {
      loadArticle();
  }
});
