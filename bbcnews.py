import requests
from bs4 import BeautifulSoup as bs

class BBC:
    def __init__(self, url:str):
        article = requests.get(url)
        self.soup = bs(article.content, "html.parser")

        self.obj = self.soup.find(id = "main-heading").text
        print(self.obj)

        self.summary = self.soup.find(class_= 'ssrcss-1xjjfut-BoldText e5tfeyi3').text
        print(self.summary)
    

article = BBC('https://www.bbc.co.uk/news/articles/cyeek2xlgzzo')

