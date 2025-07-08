(() => {
  const cipherType = document.getElementById('cipher-type');
  const keyInput = document.getElementById('key');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const encryptBtn = document.getElementById('encrypt-btn');
  const decryptBtn = document.getElementById('decrypt-btn');
  const clearBtn   = document.getElementById('clear-btn');
  const copyBtn    = document.getElementById('copy-btn');
  const toast      = document.getElementById('toast');

  function toggleButtons() {
    const hasInput = keyInput.value.trim() && inputText.value.trim();
    encryptBtn.disabled = !hasInput;
    decryptBtn.disabled = !hasInput;
  }

  keyInput.addEventListener('input', toggleButtons);
  inputText.addEventListener('input', toggleButtons);

  encryptBtn.addEventListener('click', () => process('encrypt'));
  decryptBtn.addEventListener('click', () => process('decrypt'));
  clearBtn.addEventListener('click', () => {
    keyInput.value = '';
    inputText.value = '';
    outputText.textContent = 'Your result will appear here.';
    copyBtn.disabled = true;
    toggleButtons();
  });
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputText.textContent).then(showToast);
  });

  function showToast() {
    toast.classList.remove('hidden');
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.classList.add('hidden');
    }, 1500);
  }

  function process(mode) {
    const type = cipherType.value;
    const key  = keyInput.value.trim();
    const text = inputText.value;
    let result = '';

    if (type === 'caesar') {
      result = caesar(text, parseInt(key) || 0, mode);
    } else {
      result = vigenere(text, key, mode);
    }

    outputText.textContent = result;
    copyBtn.disabled = !result;
  }

  function caesar(str, shift, mode) {
    if (mode === 'decrypt') shift = (26 - (shift % 26));
    return str.replace(/[A-Za-z]/g, ch => {
      const base = ch <= 'Z' ? 65 : 97;
      const code = ch.charCodeAt(0);
      return String.fromCharCode((code - base + shift + 26) % 26 + base);
    });
  }

  function vigenere(str, key, mode) {
    key = key.toLowerCase().replace(/[^a-z]/g, '');
    let j = 0;
    return str.replace(/[A-Za-z]/g, ch => {
      const base  = ch <= 'Z' ? 65 : 97;
      const shift = (key.charCodeAt(j % key.length) - 97) * (mode === 'encrypt' ? 1 : -1);
      j++;
      return String.fromCharCode((ch.charCodeAt(0) - base + shift + 26) % 26 + base);
    });
  }
})();
