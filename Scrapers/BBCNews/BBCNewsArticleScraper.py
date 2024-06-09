import requests
from bs4 import BeautifulSoup as bs

class BBC:
    def __init__(self, url:str):
        article = requests.get(url)
        self.soup = bs(article.content, "html.parser")
        self.summary = self.soup.find(class_= 'ssrcss-1xjjfut-BoldText e5tfeyi3')

        if self.summary is not None:
            self.summary = self.summary.text
        else:
            self.summary = ""

        self.author = self.soup.find(class_='ssrcss-68pt20-Text-TextContributorName e8mq1e96')

        if self.author is not None:
            self.author = self.author.text
        else:
            self.author = ""
        
        image = self.soup.find('img', {"class": "ssrcss-11yxrdo-Image edrdn950"})

        if image is not None:
            self.imageLink = self.soup.select('img')[0]['src']
        else:
            self.imageLink = ""

        print(self.imageLink)

    def get_article(self):
        return(self.summary, self.author, self.imageLink)
