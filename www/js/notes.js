var afileWriter;

function onNotesLoad() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSComplete, fail);
}

function onFSComplete(fileSystem) {
    // Load the notes.txt file, create it if it doesn't exist
    fileSystem.root.getFile("notes.txt", {create: true}, onFileEntryComplete, fail);
}

function onFileEntryComplete(fileEntry) {
    // read the file to preload content
    fileEntry.file(onFileReadComplete, fail);

    // set up the file writer
    fileEntry.createWriter(onFileWriterComplete, fail);
}

function onFileReadComplete(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        // load it into the form
        var form = document.getElementsByTagName('form')[0].elements;
        form.notes.value = evt.target.result;
    };
    reader.readAsText(file);
}

function onFileWriterComplete(fileWriter) {
    // store the file writer in a 
    // global variable so we have it
    // when the user presses save
    afileWriter = fileWriter;
}

function saveNotes() {
    // make sure the afileWriter is set
    if (afileWriter != null) {
		alert("afileWriter not null");
        // create an oncomplete write function
        // that will redirect the user
        afileWriter.onwrite = function(evt) {
            alert("Saved successfully");
            $.mobile.changePage("index.html");
        };
		alert("afileWriter getting notes value");
        //var form = document.getElementsByTagName('form')[0].elements;
        //var notes = form.notes.value;
        var notes =  document.getElementsById('notes').value;
		alert("notes:" + notes);
        // save the notes
        afileWriter.write(notes);
    } else {
        alert("There was an error trying to save the file");
    }
    
    return false;
}

function fail(error) {
    alert(error.code);
}