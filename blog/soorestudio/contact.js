<script>
//<![CDATA[
(function () {
  var RECIPIENT = 'worteldzgn@gmail.com';
  var MAX_LENGTH = 1500;
  // Needs a dot in the domain, which the browser's own email check does not require.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Start after the template has finished rewriting the post body, otherwise the listeners would be lost.
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var nameInput = document.getElementById('cf-name');
    var emailInput = document.getElementById('cf-email');
    var topicInput = document.getElementById('cf-topic');
    var messageInput = document.getElementById('cf-message');
    var copyButton = document.getElementById('cf-copy');
    var statusEl = document.getElementById('cf-status');

    function setStatus(text, isError) {
      statusEl.textContent = text;
      statusEl.classList.toggle('is-error', !!isError);
    }

    function showCount() {
      setStatus(messageInput.value.length + ' / ' + MAX_LENGTH + ' karakter', false);
    }

    // Returns the first invalid field with its message, or null when the form is complete.
    function findProblem() {
      if (!nameInput.value.trim()) return [nameInput, 'Nama belum diisi.'];
      if (!EMAIL_PATTERN.test(emailInput.value.trim())) return [emailInput, 'Alamat email belum benar.'];
      if (messageInput.value.trim().length < 10) return [messageInput, 'Pesan terlalu pendek.'];
      return null;
    }

    function buildSubject() {
      return '[' + topicInput.value + '] dari ' + nameInput.value.trim();
    }

    function buildBody() {
      return messageInput.value.trim() + '\n\n---\nNama: ' + nameInput.value.trim() +
        '\nEmail: ' + emailInput.value.trim() + '\nDikirim dari: ' + location.href;
    }

    function checkForm() {
      var problem = findProblem();
      if (!problem) return true;
      setStatus(problem[1], true);
      problem[0].focus();
      return false;
    }

    messageInput.addEventListener('input', showCount);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!checkForm()) return;
      location.href = 'mailto:' + RECIPIENT +
        '?subject=' + encodeURIComponent(buildSubject()) +
        '&body=' + encodeURIComponent(buildBody());
      setStatus('Aplikasi email dibuka. Kalau tidak muncul, tekan Salin pesan lalu kirim ke ' + RECIPIENT + '.', false);
    });

    copyButton.addEventListener('click', function () {
      if (!checkForm()) return;
      var text = 'Kepada: ' + RECIPIENT + '\nSubjek: ' + buildSubject() + '\n\n' + buildBody();
      var done = function () { setStatus('Pesan disalin. Tempel di aplikasi email lalu kirim ke ' + RECIPIENT + '.', false); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text);
        done();
      }
    });

    // Older browsers and non-HTTPS pages: copy through a temporary textarea.
    function fallbackCopy(text) {
      var temp = document.createElement('textarea');
      temp.value = text;
      temp.setAttribute('readonly', '');
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
    }
  });
})();
//]]>
</script>
