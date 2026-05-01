async function loadChunks() {
  const chunkList = document.getElementById('chunk-list');
  const chunkCount = document.getElementById('chunk-count');
  const errorMessage = document.getElementById('error-message');

  try {
    const response = await fetch('/chunks');
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    const chunks = Array.isArray(data.chunks) ? data.chunks : [];

    chunkCount.textContent = `Total chunks: ${chunks.length}`;

    if (chunks.length === 0) {
      chunkList.innerHTML = '<div class="empty">No chunks found.</div>';
      return;
    }

    chunkList.innerHTML = chunks
      .map((chunk, index) => {
        const text = String(chunk.text || '');
        const length = Number.isFinite(chunk.length) ? chunk.length : text.length;
        return `
          <article class="chunk-card">
            <h2>Chunk ${index + 1}</h2>
            <div class="chunk-length">Characters: ${length}</div>
            <pre>${escapeHtml(text)}</pre>
          </article>
        `;
      })
      .join('');
  } catch (error) {
    errorMessage.textContent = 'Unable to load chunks. ' + error.message;
    chunkList.innerHTML = '';
    chunkCount.textContent = '';
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.addEventListener('DOMContentLoaded', loadChunks);
