<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
            <q-input 
            bottom-slots 
            v-model="newTEtweetContent"
            class="new-tweet" 
            placeholder="What's happening?" 
            counter maxlength="280"
            autogrow 
            
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn @click="addNewTweet" unelevated rounded color="primary" label="Tweet" no-caps :disable="!newTEtweetContent" 
          class="q-mb-lg"
          />
        </div>
      </div>

      <q-separator
        class="divider" 
        size="10px" 
        color="grey-2"
      />
      
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        > 
          <q-item v-for="tweet in tweets" :key="tweet.id" class="tweet q-py-md">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Janet Williams</strong>
                <span class="text-grey-7">
                  @janet_williams
                  <br class="lt-md">&bull; {{ tweet.date | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="tweet-content text-body1">{{
                tweet.content }}
              </q-item-label>
              <div class="tweet-icons row justify-between q-mt-sm">
                <q-btn flat round color="grey" icon="far fa-comment" size="small"/>
                <q-btn flat round color="grey" icon="fas fa-retweet" size="small"/>
                <q-btn @click="toggleLiked(tweet)" flat round :color="tweet.liked ? 'red' : 'grey'" :icon="tweet.liked ? 'fas fa-heart' : 'far fa-heart'" size="small"/>
                <q-btn @click="deleteTweet(tweet)" flat round color="grey" icon="fas fa-trash" size="small"/>
              </div>
            </q-item-section>

          </q-item>
        </transition-group>

      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>

import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageHome',
  data() {
    return {
      newTEtweetContent: '',
      tweets: [
        //{
          //id: 'ID1',
          //content: 'Another day going on with covid, hoping we will be able to get back to normal soon enough',
          //date: 1621354471429,
          //liked: false 
        //},
        //{
          //id: 'ID2',
          //content: 'The Nba playoffs start tonight. Lets go Heat!',
          //date: 1621354576585,
          //liked: true 
        //}
      ]
    }
  },
  methods: {
    addNewTweet() {
      let newTweet = {
        content: this.newTEtweetContent,
        date: Date.now(),
        liked: false
      }
      // this.tweets.unshift(newTweet)
      db.collection('tweets').add(newTweet)
      .then(function(docRef) {
        console.log('Document written with ID: ', docRef.id)
      })
      .catch(function(error) {
        console.error('Error adding document: ', error)
      })
      this.newTEtweetContent = ''
    },
    deleteTweet(tweet) {
      db.collection('tweets').doc(tweet.id).delete().then(function() {
        console.log('Document successfully deleted!');
      }).catch(function(error) {
        console.error('Error removing document: ', error);
      })
    },
    toggleLiked(tweet) {
      db.collection('tweets').doc(tweet.id).update({
        liked: !tweet.liked 
      })
      .then(function() {
        console.log("Document successfully updated!")
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error)
      })
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    db.collection('tweets').orderBy('date')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          let tweetChange = change.doc.data()
          tweetChange.id = change.doc.id
          if (change.type === 'added') {
            console.log('New tweet: ', tweetChange)
            this.tweets.unshift(tweetChange)
          }
          if (change.type === 'modified') {
            console.log('Modified tweet: ', tweetChange)
            let index = this.tweets.findIndex(tweet => tweet.id === tweetChange.id)
            Object.assign(this.tweets[index], tweetChange)
          }
          if (change.type === 'removed') {
            console.log('Removed tweet: ', tweetChange)
            let index = this.tweets.findIndex(tweet => tweet.id === tweetChange.id)
            this.tweets.splice(index, 1)
          }
        })
      })
  }
}
</script>

<style lang="sass">
.new-tweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider 
  border-top: 1px solid
  border-bottom: 1px solid 
  border-color: $grey-4
.tweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.tweet-content
  white-space: pre-line
.tweet-icons
  margin-left: -5px
</style>