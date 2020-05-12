var dbGlobals = {}; // Store all indexedDB related objects in a global object called "dbGlobals".
dbGlobals.db = null; // The database object will eventually be stored here.    
dbGlobals.description = "This database is used to store files locally."; // The description of the database.
dbGlobals.name = "localFileStorage"; // The name of the database.
dbGlobals.version = 1; // Must be >= 1. Be aware that a database of a given name may only have one version at a time, on the client machine.     
dbGlobals.storeName = "fileObjects"; // The name of the database's object store. Each object in the object store is a file object.
dbGlobals.message = ""; // When useful, contains one or more HTML strings to display to the user in the 'messages' DIV box.
dbGlobals.empty = true; // Indicates whether or not there's one or more records in the database object store. The object store is initially empty, so set this to true.



self.onsync = function (event) {
  if (event.tag == 'example-sync') {
    event.waitUntil(this.syncIt());
  }
}




function syncIt() {
  console.log("syncit");
  return getIndexedDB()
    .then(sendToServer)
    .then(clearDB)
    .catch(function (err) {
      return err;
    })
}

function getIndexedDB() {
  console.log("getindexeddb");
  return new Promise(function (resolve, reject) {
    dbGlobals.db = indexedDB.open(dbGlobals.name);
    dbGlobals.db.onsuccess = function (event) {
      this.result.transaction(dbGlobals.storeName).objectStore(dbGlobals.storeName).getAll().onsuccess = function (event) {
        resolve(event.target.result);
      }
    }
    dbGlobals.db.onerror = function (err) {
      reject(err);
    }
  });
}

function sendToServer(response) {
  console.log("sendtoserver");
  console.log(response);
  var data = new FormData();
  for (var i = 0; i < response.length; i++) {
    let file = response[i];
    data.append('files[]', file);
  }
  console.log("file");
  return res = fetch('./save.php', {
    method: 'POST',
    body: data,
  }).then(function (rez2) {
    console.log("sent files");
    return rez2.text();
  }).catch(function (err) {
    return err;
  })
}


function clearDB() {
  console.log("clearing");
  return new Promise(function (resolve, reject) {
    dbGlobals.db = indexedDB.open(dbGlobals.name);
    dbGlobals.db.onsuccess = function (event) {
      this.result.transaction(dbGlobals.storeName,"readwrite").objectStore(dbGlobals.storeName).clear().onsuccess = function (event) {
        resolve(event.target.result);
      }
    }
    dbGlobals.db.onerror = function (err) {
      reject(err);
    }
  });
}
