// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('vue/dist/vue')
const fs = require('fs');
const Path = require('path');
const twemoji = require('twemoji')
var rimraf = require("rimraf");

let vueApp = new Vue({
  el: '#app',
  data: {
    message: 'Welcome back, Death.',
    buttonText: 'Kill off.',
    settingsButtonText: 'Settings',
    searchButtonText: "Search",
    refreshButtonText: "Refresh",
    popupTitle: "Delete?",
    isButtonLoading: false,
    isButtonDisabled: false,
    isSearchButtonLoading: false,
    isSearchButtonDisabled: false,
    paths: [
      { "text": "No Paths found", "value": "null" }
    ],
    pathSettings: [
      { "text": "No Paths, set some", "value": "null" }
    ],
    potentialDeletions: [],
    twemoji: twemoji,
  },
  methods: {
    deleteButton: function () {
      this.isButtonLoading = true
      document.getElementById("popUp").classList.add("is-active")

      let list = document.getElementById("list")
      let path = list.options[list.selectedIndex].text

      // find all things in directory
      let potentialDeletions = fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path).isDirectory();
      });

      // join all paths together
      var i;
      for (i = 0; i < potentialDeletions.length; i++) {
        potentialDeletions[i] = { "text": Path.join(path, potentialDeletions[i]) }
      }

      this.potentialDeletions = potentialDeletions

      console.log(this.potentialDeletions)

      this.isButtonLoading = false
    },
    settingsButton: function () {
      document.getElementById("settings").classList.add("is-active")

      let rawdata = fs.readFileSync('./settings.json')
      let settings = JSON.parse(rawdata) 
      
      var i;
      for (i = 0; i < settings["paths"].length; i++) {
        this.pathSettings[i] = {
          "text": settings["paths"][i]
        }
      }
    },
    addPath: function () {
      let dirSelect = document.getElementById('dirSelect')

      // searches for settings
      let rawdata = fs.readFileSync('./settings.json')
      let settings = JSON.parse(rawdata)

      settings["paths"].push(dirSelect.files[0].path)

      console.log(settings.paths)

      // save
      let data = JSON.stringify(settings)
      fs.writeFileSync('./settings.json', data)

      this.pathSettings = []
      var i;
      for (i = 0; i < settings["paths"].length; i++) {
        this.pathSettings[i] = {
          "text": settings["paths"][i]
        }
      }
    },
    search: function () {
      this.isSearchButtonLoading = true

      // searches for settings
      let rawdata = fs.readFileSync('./settings.json')
      let settings = JSON.parse(rawdata)

      let directories = []
      var tally = 0

      // makes array of objects with both "value", "text"
      var i;
      for (i = 0; i < settings["paths"].length; i++) {
        let path = settings["paths"][i]

        // search the path for files
        let dirs = fs.readdirSync(path).filter(function (file) {
          return fs.statSync(path)
        });

        var j;
        for (j = 0; j < dirs.length; j++) {
          // join the file name and the current path we are searching
          let path = Path.join(settings["paths"][i], dirs[j])

          if (fs.lstatSync(path).isDirectory()) {
            directories[tally] = {"text": path, "value": path}
            // increase tally
            tally++
          }
        }
      }

      this.paths = directories
      this.isSearchButtonLoading = false
    },
    confirmDeleteButton: function () {
      let list = document.getElementById("list")
      // get selcted item in list
      rimraf.sync(list.options[list.selectedIndex].text)
      this.search()
    }
  },
  created: function(){
    console.log("Hey!")
    let rawdata = fs.readFileSync('./settings.json')
    let settings = JSON.parse(rawdata)

    if (settings.first_run == true) {
      document.getElementById("settings").classList.add("is-active")
      settings.first_run = false

      let data = JSON.stringify(settings)
      fs.writeFileSync('./settings.json', data)

      this.pathSettings = []
      var i;
      for (i = 0; i < settings["paths"].length; i++) {
        this.pathSettings[i] = {
          "text": settings["paths"][i]
        }
      }
    }
    this.search()
  }
})
