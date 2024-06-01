document.addEventListener('DOMContentLoaded', function() {

    // Function to calculate relative time (e.g., "5h ago", "1d ago")
    function formatRelativeTime(timestamp) {
        const now = Date.now() / 1000; // Convert current time to Unix timestamp
        const secondsSince = now - timestamp;

        if (secondsSince < 60) {
            return Math.floor(secondsSince) + 's ago';
        } else if (secondsSince < 3600) {
            return Math.floor(secondsSince / 60) + 'm ago';
        } else if (secondsSince < 86400) {
            return Math.floor(secondsSince / 3600) + 'h ago';
        } else {
            return Math.floor(secondsSince / 86400) + 'd ago';
        }
    }

    const articlesPerPage = 10;
    let currentIndex = 0;

    // Load articles with formatted relative time
    function loadArticles() {
        fetch('images/articles.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.sort((a, b) => b.timestamp - a.timestamp); // Sort articles by Unix timestamp, newest first
                const articlesContainer = document.getElementById('articles');
                articlesContainer.innerHTML = ''; // Clear existing articles

                // Load only the latest 10 articles or less if there are fewer than 10 articles
                const endIndex = Math.min(currentIndex + articlesPerPage, data.length);
                for (let i = currentIndex; i < endIndex; i++) {
                    const article = data[i];
                    const articleElement = document.createElement('article');

                    const title = document.createElement('h2');
                    const link = document.createElement('a');
                    link.href = `article.html?id=${article.id}`;
                    link.textContent = article.title;
                    title.appendChild(link);

                    const image = document.createElement('img');
                    image.src = `images/${article.image}`;
                    image.alt = article.title;

                    const info = document.createElement('p');
                    const time = document.createElement('span');
                    time.textContent = formatRelativeTime(article.timestamp);
                    info.textContent = `${time.textContent} | ${article.author} | ${article.genre}`;

                    articleElement.appendChild(title);
                    articleElement.appendChild(image);
                    articleElement.appendChild(info);

                    articlesContainer.appendChild(articleElement);
                }

                currentIndex += articlesPerPage;

                // Hide the "Load 10 more" button if there are no more articles to load
                if (currentIndex >= data.length) {
                    document.getElementById('load-more').style.display = 'none';
                } else {
                    document.getElementById('load-more').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching the articles:', error);
                document.getElementById('articles').innerHTML = '<p>Error loading articles.</p>';
            });
    }


    function initialize() {
        loadArticles();  // Initial load

        document.getElementById('load-more').addEventListener('click', loadArticles);
    }

    initialize();
});
