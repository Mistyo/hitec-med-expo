export async function compressImage(file: File): Promise<File> {
    // Don't try to compress PDFs — just return as-is
    if (file.type === 'application/pdf') {
      return file
    }
  
    return new Promise((resolve) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
  
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
  
        try {
          // Cap longest side at 1400px to keep dimensions reasonable
          const MAX = 1400
          let { width, height } = img
  
          if (width > MAX || height > MAX) {
            if (width > height) {
              height = Math.round((height / width) * MAX)
              width = MAX
            } else {
              width = Math.round((width / height) * MAX)
              height = MAX
            }
          }
  
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
  
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            // Canvas context failed — return original
            resolve(file)
            return
          }
  
          ctx.drawImage(img, 0, 0, width, height)
  
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
  
          // Convert base64 dataUrl back to a File
          fetch(dataUrl)
            .then(r => r.blob())
            .then(blob => {
              const compressed = new File([blob], 'compressed.jpg', { type: 'image/jpeg' })
              // If compression somehow made it bigger, return original
              resolve(compressed.size < file.size ? compressed : file)
            })
            .catch(() => resolve(file)) // fetch failed — return original
  
        } catch {
          // Canvas failed entirely — return original
          resolve(file)
        }
      }
  
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(file) // Image load failed — return original
      }
  
      img.src = objectUrl
    })
  }