import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from BBCNewsArticleScraper import BBC
import json

file_path = 'images/articles.json'

def scrape_BBC_rss(url):

    # Parse the RSS feed
    feed = feedparser.parse(url)
    x = 42
    y = 38

    # Step 1: Read the existing JSON data from the file
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"The file {file_path} does not exist. Initializing with an empty list.")
        data = []
    except json.JSONDecodeError:
        print(f"Error decoding JSON from the file {file_path}. Initializing with an empty list.")
        data = []

    # Iterate over the entries in the feed
    for entry in feed.entries:

        # Extract relevant information from each entry
        title = entry.title
        link = entry.link
        published = entry.published

        timestamp_format = '%a, %d %b %Y %H:%M:%S %Z'
        dt = datetime.strptime(published, timestamp_format)
        unix_timestamp = int(dt.timestamp())

        template = {
            "id": 16,
            "title": "Swedish student blocks police during anti-Israel protest and gets arrested - video shows",
            "timestamp": 1717419420,
            "platform": "X",
            "author": "Visegrád 24",
            "tags": ["Israel", "Sweden", "Police", "Israel Gaza Conflict"],
            "media": ["image20.jpg", "video6.mp4"],
            "content": "Visegrád has posted footage on their X account showing what they describe as: 'Swedish police arrests an international student near the “Liberated Zone” anti-Israel encampment at Lund University'. The video does in fact show a lady with a megaphone getting arrested by Swedish police. Visegrád also added that 'After first blocking the police van, the student becomes remorseful when she realizes that she will get arrested'."
        }

        summary, author, imageLink = BBC(link).get_article()

        img_data = requests.get(imageLink).content 

        with open('images/image'+str(x)+'.jpg', 'wb') as handler: 
            handler.write(img_data) 

        template["title"] = title
        template["timestamp"] = unix_timestamp
        template["id"] = y
        template["platform"] = "BBC"
        template["author"] = author
        template["tags"] = ["Technology", "BBC News"]
        template["media"] = ["image"+str(x)+".jpg"]
        template["content"] = summary
       

        # Append the new entry to the existing data
        if isinstance(data, list):
            data.append(template)
        else:
            print("The JSON file does not contain a list at the root.")
            data = [template]

        x += 1
        y += 1

    # Step 2: Write the updated JSON data back to the file
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

    print("New entries have been successfully appended.")

print("Starting script execution.")

# Call the function
scrape_BBC_rss('https://feeds.bbci.co.uk/news/technology/rss.xml')

print("Script execution completed.")

