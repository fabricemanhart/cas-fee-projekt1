function generateRandomNotes(amount) {

  for (var i = 0; i < amount; i++) {
    var note = {
      title: "Test Title",
      description: "Test text Test text Test text Test text Test text",
      importance: getRandomNumber(0, 5),
      dueDate: getRandomDate(2017, 2018).toISOString().slice(0, 10),
      creationDate: getRandomDate(2017, 2017),
      completionDate: null
    }

    if (isCompleted()) {
      note.completionDate = getRandomDate(2018, 2018);
      note.completed = true;
    }

    createOrUpdateNoteInLocalStorage(generateGuid(), note);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isCompleted() {
  return false;
  return !!getRandomNumber(0, 1);
}

function getRandomDate(minYear, maxYear) {
  var year = getRandomNumber(minYear, maxYear);
  var month = getRandomNumber(0, 11);
  var day = getRandomNumber(1, 31);

  return new Date(year, month, day);
}

//delete after
function createOrUpdateNoteInLocalStorage(key, note) {
  
    localStorage.setItem(key, JSON.stringify(note));
  
}

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
