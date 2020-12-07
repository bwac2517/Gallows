// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('./node_modules/vue/dist/vue')
const fs = require('fs');
const Path = require('path');

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => Path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function searchDirectories() {
  this.isSearchButtonLoading = true
  let searchLocations = ["X:\\User\\Documents", "X:\\User\\Desktop"]
  let directories = []
  var i;
  for (i = 0; i < searchLocations.length; i++) {
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

let vueApp = new Vue({
  el: '#app',
  data: {
    message: 'Welcome back, Death.',
    buttonText: 'Kill off.',
    settingsButtonText: 'Settings',
    searchButtonText: "Search",
    refreshButtonText: "Refresh",
    isButtonLoading: false,
    isButtonDisabled: false,
    isSearchButtonLoading: false,
    isSearchButtonDisabled: false,
    paths: []
  },
  methods: {
    button: function () {
      this.isButtonLoading = true
      deleteFolderRecursive(document.getElementById("list").value)
      this.paths = searchDirectories()
      this.isButtonLoading = false
      console.log(this.paths.length)
    },
    search: function () {
      this.paths = searchDirectories()
    }
  },
  created: function(){
    this.paths = searchDirectories()
  }
})
