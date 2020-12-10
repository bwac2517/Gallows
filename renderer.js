// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('./node_modules/vue/dist/vue')
const fs = require('fs');
const Path = require('path');
var rimraf = require("rimraf");


const deleteFolderRecursive = function(path) {
  console.log(path)
  rimraf.sync(path);
};

function getDirectories(path, searchLocations) {

  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path).isDirectory();
  });
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => Path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function searchDirectories() {
  this.isSearchButtonLoading = true
  let rawdata = fs.readFileSync('./Gallows/settings.json')
  let settings = JSON.parse(rawdata)

  let searchLocations = settings["paths"]

  let directories = []
  var i;
  for (i = 0; i < searchLocations.length; i++) {
    let dirs = getDirectories(searchLocations[i])
    var j;
    for (j = 0; j < searchLocations.length; i++) {

    }
    console.log(dirs)
    directories = directories.concat(getDirectories(searchLocations[i]));
  }

  let list = document.getElementById("list")
  list.innerHTML = '';
  console.log(directories)

  var i;
  for (i = 0; i < directories.length; i++) {
    const option = document.createElement('option');
    option.value = directories[i];
    option.innerHTML = directories[i]
    list.appendChild(option)
    this.isSearchButtonLoading = false
  }
  return directories
}

Vue.component('path-option', {
  props: ['text', 'value'],
  template: '<option value="{{ value.value }}">{{ text.text }}</option>'
})

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
    paths: []
  },
  methods: {
    button: function () {
      this.isButtonLoading = true
      this.isPopupActive = true
      let directories = searchDirectories()

      this.paths = getDirectories()
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
    this.paths = searchDirectories()
  }
})
