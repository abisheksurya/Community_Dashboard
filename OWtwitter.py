#import requests
import tweepy
from tweepy import Stream
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
import elasticsearch
ACCESS_TOKEN = '793829198112501760-41cDNkTYIlAtueTlVeVFnNTvAYd4aN1'
ACCESS_SECRET = 'weEGrhmG7doH4dwIbDtMYAcjTllWOoUla5KhDWkP88doZ'
CONSUMER_KEY = 'UliqTh4cO7UZyIYsXN2wtZdyw'
CONSUMER_SECRET = 'kcLRRCC1lVUIrXfLckS4eQsokTzW2ryj5f1z80Gsv5fWzeVkmp'
auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)

api = tweepy.API(auth)

# user = api.get_user('GlusterDev')


class listener(StreamListener):
    def on_data(self, data):
        print (data)
    def on_error(self, status):
        print (status)

twitterStream = Stream(auth, listener())

es = elasticsearch.Elasticsearch([{'host': 'localhost', 'port': 9200}])
es.index(index='testtwitter', id=1, body={

    twitterStream.filter(track=["Overwatch"])
    
})

print(es.get(index='testtwitter', doc_type='trends', id=1))
