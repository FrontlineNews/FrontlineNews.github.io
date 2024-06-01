document.addEventListener('DOMContentLoaded', function() {
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

    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

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
                    document.getElementById('article-title').textContent = article.title;
                    document.getElementById('article-info').textContent = `${formatDateTime(article.timestamp)} | ${article.author} | ${article.genre}`;
                    document.getElementById('article-image').src = 'images/' + article.image;
                    
                    // Replace "\n" with HTML line breaks
                    const articleContent = document.getElementById('article-content');
                    articleContent.innerHTML = article.content.replace(/\n/g, '<br>');
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
