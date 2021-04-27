<template>
  <div id="app">
    <div v-if="Noapikey">
      <input type="text" name="Api" v-model="apiKey" v-on:keyup.enter="Api">
      <input type="submit" value="Api" @click="Api" >
      <br>
      <h6>Get api key from <a  target="_blank" href="https://rapidapi.com/kuronekony4n/api/simpleanime/endpoints">simpleanime</a></h6>
    </div>
    <div v-else>
      <div v-if="loading">
          <img class="loader" src="./assets/loader.gif"/>
      </div>
      <div v-else>
        <video autoplay muted loop id="myVideo">
          <source src="./assets/walpaper.mp4" type="video/mp4">
        </video>
        <div class="Nav">
          <button @click="back()">Prev</button>
          <button @click="next()">Next</button>
          <button @click="reapi()">Change Api Key</button>
          <button v-if="!showif" @click="addtoDl()">Add all to Download</button>
          <button :class="{toggled: isToggled}" @click="isToggled = !isToggled">Show Download</button>
        </div>
        <div :class="{Search: isClose ,Search2: !isClose}">
          <img class="icon" src="./assets/search.png" @click="isClose = !isClose"/>
          <input type="text" name="Search" v-model="animeName" v-on:keyup.enter="validate">
          <input type="submit" value="Search" @click="validate" >
        </div>
        <div class="downloads" :class="{hidden: isToggled}">
          <button @click="Downloads()">Download All</button>
          <button :class="{toggled: isToggled}" @click="isToggled = !isToggled">Hide Download</button>
          <ol>
            <li v-for="(anime,index) in downloads" :key="index">
              <h2>{{anime.title}}</h2>
              <h3>{{anime.status}}</h3>
            </li>
          </ol>
        </div>
        <div class="anime" v-if="streamif">
        
          <ol v-if="showif">
            <li v-for="(anime,index) in result" :key="index">
              <img :src="anime.cover" @click="show(anime.vid_id)"/>
              <h2>{{anime.title}}</h2>
            </li>
          </ol>
          <ol v-else>
            <li v-for="(anime,index) in anime" :key="index">
              <img :src="anime.cover" @click="stream(anime.vid_id)"/>
              <h2>{{anime.episode}}</h2>
              <button @click="download(anime.vid_id)">Add to Download</button>
            </li>
          </ol>
        </div>
        <div v-else class="streamer">
          <iframe :src="streamurl">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const Aria2 = require("aria2");
const aria2 = new Aria2();
export default {
  
  data(){
    return{
      apiKey:"",
      animeName:"",
      result:[],
      anime:[],
      downloads:[],
      streamurl:"",
      gid:[],
      test:{},
      showif:1,
      streamif:1,
      isToggled:true,
      loading: false,
      isClose:true,
      Noapikey:true,
    }
  },
  mounted() {
    this.loading = true
    if (this.$cookies.isKey("apiKey")){
      this.apiKey = this.$cookies.get("apiKey");
      this.Noapikey = this.$cookies.get("Noapikey");
    }
  },
  methods:{
    async InitMyApp(){
      var axios = require("axios").default;

      var options = {
        method: 'GET',
        url: 'https://simpleanime.p.rapidapi.com/anime/list/recent',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'simpleanime.p.rapidapi.com'
        }
      };

      var x = axios.request(options).finally(() => (this.loading = false));
        
      this.result = (await x).data.data;
      this.showif = 1;
      this.streamif = 1;
    },
    Api(){
      this.Noapikey=false;
      this.$cookies.set("apiKey", this.apiKey);
      this.$cookies.set("Noapikey",this.Noapikey);
      this.InitMyApp();
    },
    reapi(){
      this.Noapikey=true;
    },
    back(){
      if(this.showif==0)
        if(this.streamif==0){
          this.streamif=1;
        }
        else
          this.showif=1;
    },
    next(){
      if(this.showif==1)
          this.showif=0
      else
          this.streamif=0;
    },
    async validate(){
      this.loading = true
      console.log("hi");
      var axios = require("axios").default;
      var text = encodeURI(this.animeName);
      var url = 'https://simpleanime.p.rapidapi.com/anime/search/'+text;
      console.log(url)
      var options = {
        method: 'GET',
        url: url,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'simpleanime.p.rapidapi.com'
        }
      };
      var x = axios.request(options).finally(() => (this.loading = false))
      
      this.result = (await x).data.data;
      this.showif = 1;
      this.streamif = 1;
      
    },
    async show(text){
      this.loading = true
      console.log("hi");
      var axios = require("axios").default;
      var url = 'https://simpleanime.p.rapidapi.com/anime/info/videos/'+text;
      console.log(url)
      var options = {
        method: 'GET',
        url: url,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'simpleanime.p.rapidapi.com'
        }
      };
      var x = axios.request(options).finally(() => (this.loading = false))
      console.log(await x)
      this.anime = (await x).data.episode;
      this.showif = 0;
    },
    async stream(text){
      this.loading = true
      console.log("hi");
      var axios = require("axios").default;
      
      var url = 'https://simpleanime.p.rapidapi.com/anime/info/videos/'+text;
      console.log(url)
      var options = {
        method: 'GET',
        url: url,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'simpleanime.p.rapidapi.com'
        }
      };
      var x = axios.request(options).finally(() => (this.loading = false))
      this.streamurl = (await x).data.data[0].stream;
      this.streamif = 0;
    },
    async download(text){
      var axios = require("axios").default;
      
      var url = 'https://simpleanime.p.rapidapi.com/anime/info/videos/'+text;
      console.log(url)
      var options = {
        method: 'GET',
        url: url,
        headers: {
          'x-rapidapi-key':  'get it from rapidapi',
          'x-rapidapi-host': 'simpleanime.p.rapidapi.com'
        }
      };
      var x = axios.request(options)
      var did = (await x).data.data[0].download_id;
      
      url = 'https://simpleanime.p.rapidapi.com/anime/get/download/'+did;
      options = {
        method: 'GET',
        url: url,
        headers: {
          'x-rapidapi-key':  'get it from rapidapi',
          'x-rapidapi-host': 'simpleanime.p.rapidapi.com'
        }
      };

      x = axios.request(options)
      x = (await x).data.data[0].url;
      console.log(x);
      this.downloads.push({
        "title":text,
        "dlink":x,
        "status":"Not Downloaded",
      })
    },
    async addtoDl(){
      for(var x in this.anime){
        this.download(this.anime[x].vid_id);
      }
      this.$swal("All episodes added to download")
    },
    async Downloads(){
      this.$swal("Download Started")
      aria2
      .open()
      .then(() => console.log("open"))
      .catch(err => console.log("error", err));
      var batch = []
      var path =  process.env.USERPROFILE + "\\Downloads\\jcc";
      for(var x in this.downloads){
        batch.push(["addUri",[this.downloads[x].dlink],{dir:path}])
      }
      await aria2.batch(batch);
      var i =0;
      aria2.on("onDownloadStart", ([guid]) => {
        this.downloads[i].status="Downloading";
        console.log(guid);
      })
      aria2.on("onDownloadComplete", ([guid]) => {
        this.downloads[i].status="Downloaded";
        console.log(guid);
        i++;
      });
    },
    open(){

    },
  }
}
</script>
<style scoped>
  ol{
    list-style:none;
  }
  li {
    width: 33%;
    float: left;
    list-style: none;
  }
  img{
    width: 30vw;
    height: 50vh;
  }
  .anime{
    display: flex;
    flex-direction: row-reverse;
    width: 75%;
    justify-content: center;
    align-items: center;
    width:90%;
    background-color:rgba(255,255,255,.8);
    border-radius:40px;
    box-shadow:0 0 20px rgba(122, 0, 122, 0.349) inset;
    box-sizing:border-box;
    padding: 10vmin;
    transform: translate(5%) ;
    z-index: 1;
  }
  iframe{
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 95%;
  }
  .hidden{
    display: none;
  }
  .downloads{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color:rgba(255,255,255,.8);
    border-radius:40px;
    box-shadow:0 0 20px rgba(122, 0, 122, 0.349) inset;
    overflow: scroll;
  }
  .downloads>button{
    height: 50px;
    margin: 0.1vw;
    background-color:rgba(255,255,255,.8);
    border-radius:40px;
    box-shadow:0 0 20px rgba(122, 0, 122, 0.349) inset;
  }
  .loader{
    position: fixed;
    top:25%;
    left:35%;
  }
  .Nav{
    position:fixed;
    top:0;
    left: 0;
    margin: 0;
    width: 100vw;
    display: block;
    flex-direction: unset;
    z-index: 2;
  }
  .Nav>button{
    height: 50px;
    margin: 0.1vw;
    background-color:rgba(255,255,255,.8);
    border-radius:40px;
    box-shadow:0 0 20px rgba(122, 0, 122, 0.349) inset;
  }
  .Search{
    display: flex;
    flex-direction: row;
    position:fixed;
    top:70px;
    right: 0;
    margin: 0;
    transform: translateX(79%);
    z-index: 3;
  }
  .Search2{
    display: flex;
    flex-direction: row;
    position:fixed;
    top:70px;
    right: 0;
    margin: 0;
    transform: translateX(0%);
    z-index: 3;
  }
  .Search2>input{
    height: 50px;
    margin: 0.1vw;
    background-color:rgba(255,255,255,.8);
    border-radius:40px;
    border-style: groove;
    border-color: black;
    box-shadow:0 0 20px rgba(122, 0, 122, 0.349) inset;
  }
  .icon{
    width: 50px;
    height: 50px;
    margin: 0.1vw;
    background-color:rgba(255,255,255,.8);
    border-radius:40px;
    border-style: groove;
    border-color: black;
    box-shadow:0 0 20px rgba(122, 0, 122, 0.349) inset;
  }
  .toggled{
    transform: translateX(40vw);
  }
  #myVideo {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
  }
</style>>

