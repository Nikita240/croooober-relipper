// Saves options to chrome.storage
function save_options() {
  var frontWidth = document.getElementById('front-width').value;
  var rearWidth = document.getElementById('rear-width').value;
  chrome.storage.sync.set({
    frontWidth,
    rearWidth,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    frontWidth: 9,
    rearWidth: 11,
  }, function(items) {
    document.getElementById('front-width').value = items.frontWidth;
    document.getElementById('rear-width').value = items.rearWidth;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
