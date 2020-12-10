// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('./node_modules/vue/dist/vue')
const fs = require('fs');
const Path = require('path');
var rimraf = require("rimraf");


const deleteFolderRecursive = function(path) {
  rimraf.sync(path);
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path).isDirectory();
  });
}

function searchDirectories() {
  this.isSearchButtonLoading = true
  let rawdata = fs.readFileSync('./Gallows/settings.json')
  let settings = JSON.parse(rawdata)

  let directories = []

  var tally = 0

  var i;
  for (i = 0; i < settings["paths"].length; i++) {
    let path = settings["paths"][i]
    let dirs = getDirectories(path)
    var j;
    for (j = 0; j < dirs.length; j++) {
      let path = Path.join(settings["paths"][i], dirs[j])

      if (fs.lstatSync(path).isDirectory()) {
        directories[tally] = {"text": path}
        tally++
      }
    }
  }
  return directories
}

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
    isPopupActive: false,
    paths: [
      {"text": "No directories found"}
    ]
  },
  methods: {
    button: function () {
      this.isButtonLoading = true
      this.isPopupActive = true
      this.isButtonLoading = false
    },
    search: function () {
      this.paths = searchDirectories()
    },
    cancel: function () {
      this.isPopupActive = false
    }
  },
  created: function(){
    let directories = searchDirectories()

    this.paths = directories
    console.log(this.paths)
  }
})
