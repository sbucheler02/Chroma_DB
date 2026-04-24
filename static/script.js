const loadButton = document.getElementById("load-documents");
const container = document.getElementById("documents-container");

const renderDocuments = (documents) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    container.innerHTML = "<p class='message'>No documents found.</p>";
    return;
  }

  console.log("Documents loaded:", documents);

  const list = document.createElement("ul");
  list.className = "document-list";

  documents.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "document-item";

    const id = item?.id ?? item?.doc_id ?? item?.uuid ?? item?.pk ?? item?.ids ?? "(no id)";
    const documentText =
      typeof item === "string"
        ? item
        : item?.document ?? item?.text ?? item?.content ?? item?.documents ?? JSON.stringify(item);

    listItem.innerHTML = `
      <div class="document-id">${id}</div>
      <div class="document-text">${documentText}</div>
    `;
    list.appendChild(listItem);
  });

  container.innerHTML = "";
  container.appendChild(list);
};

const showError = (message) => {
  container.innerHTML = `<p class="error">${message}</p>`;
};

loadButton?.addEventListener("click", async () => {
  container.innerHTML = "<p class='message'>Loading documents…</p>";

  try {
    const response = await fetch("/documents");
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const documents = await response.json();
    renderDocuments(documents);
  } catch (error) {
    showError(`Failed to load documents: ${error.message}`);
  }
});
