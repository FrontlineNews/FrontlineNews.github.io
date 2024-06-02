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

    // Function to display article content with new lines
    function formatArticleContent(content) {
        return content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
    }

    // Function to create a slideshow for media content
    function createSlideshow(media) {
        const slideshowContainer = document.createElement('div');
        slideshowContainer.className = 'slideshow-container';

        media.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = 'images/' + item.src;
                img.alt = item.alt || 'Article image';
                slide.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = 'images/' + item.src;
                video.controls = true;
                slide.appendChild(video);
            }

            slideshowContainer.appendChild(slide);
        });

        return slideshowContainer;
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
                    const mediaElements = (article.media || []).map(src => ({
                        type: src.includes('.mp4') ? 'video' : 'image',
                        src: src
                    }));

                    if (mediaElements.length > 0) {
                        const slideshow = createSlideshow(mediaElements);
                        mediaContainer.appendChild(slideshow);
                    } else {
                        document.getElementById("media-container").innerHTML = '<p>No media available.</p>';
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
