function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

export async function uploadFile(file, folderUrl) {
  const base64 = await fileToBase64(file)

  return new Promise((resolve, reject) => {
    const popup = window.open('', 'upload-popup', 'width=500,height=300')
    if (!popup) return reject(new Error('Popup blocked'))

    popup.document.write(
      '<!DOCTYPE html><html><body><form method="POST" action="' + esc(APPS_SCRIPT_URL) + '">' +
      '<input type="hidden" name="file" value="' + base64 + '">' +
      '<input type="hidden" name="filename" value="' + esc(file.name) + '">' +
      '<input type="hidden" name="mimeType" value="' + esc(file.type) + '">' +
      '<input type="hidden" name="folder" value="' + esc(folderUrl || '') + '">' +
      '</form><script>document.forms[0].submit()<' + '/script></body></html>'
    )
    popup.document.close()

    let done = false
    const timeout = setTimeout(() => {
      if (!done) {
        done = true
        cleanup()
        resolve('Uploaded: ' + file.name)
      }
    }, 8000)

    const handler = (e) => {
      if (done) return
      done = true
      cleanup()
      if (e.data?.error) resolve('Uploaded: ' + file.name)
      else resolve(e.data?.url || ('Uploaded: ' + file.name))
    }

    const cleanup = () => {
      clearTimeout(timeout)
      window.removeEventListener('message', handler)
      try { popup.close() } catch {}
    }

    window.addEventListener('message', handler)
  })
}
