document.addEventListener("DOMContentLoaded", () => {
  const loadButton = document.getElementById("load-documents");
  const container = document.getElementById("documents-container");
  const searchButton = document.getElementById("search-button");
  const queryInput = document.getElementById("query-input");
  const searchContainer = document.getElementById("search-results-container");

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

  const renderSearchResults = (results) => {
    if (!Array.isArray(results) || results.length === 0) {
      searchContainer.innerHTML = "<p class='message'>No matching results.</p>";
      return;
    }

    const list = document.createElement("ul");
    list.className = "document-list";

    results.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "document-item";

      listItem.innerHTML = `
        <div class="document-id">${item.id}</div>
        <div class="document-text">${item.document}</div>
        <div class="document-distance">Distance: ${item.distance}</div>
      `;
      list.appendChild(listItem);
    });

    searchContainer.innerHTML = "";
    searchContainer.appendChild(list);
  };

  const showSearchError = (message) => {
    searchContainer.innerHTML = `<p class="error">${message}</p>`;
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

  searchButton?.addEventListener("click", async () => {
    const query = queryInput?.value?.trim();
    console.log("Search clicked", query);
    if (!query) {
      showSearchError("Please enter a search query.");
      return;
    }

    searchContainer.innerHTML = "<p class='message'>Searching…</p>";

    try {
      const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const results = await response.json();
      console.log("Search results", results);
      renderSearchResults(results);
    } catch (error) {
      showSearchError(`Search failed: ${error.message}`);
    }
  });

  queryInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchButton?.click();
    }
  });
});
