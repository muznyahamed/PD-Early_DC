document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const fileList = document.getElementById('fileList');
  const deleteAllBtn = document.getElementById('deleteAllBtn');

  // Fetch and display uploaded files
    async function fetchFiles() {
    try {
      const response = await fetch('https://parkison-data-collection.glitch.me/files');
      const files = await response.json();

      fileList.innerHTML = '';
      files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file.name;
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const buttonsDiv = document.createElement('div'); // Create a container for buttons
        buttonsDiv.className = 'btn-group';

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.className = 'btn btn-primary';
        downloadBtn.addEventListener('click', () => downloadFile(file._id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.addEventListener('click', () => deleteFile(file._id));

        buttonsDiv.appendChild(downloadBtn);
        buttonsDiv.appendChild(deleteBtn);

        li.appendChild(buttonsDiv); // Add the button container to the list item
        fileList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Error fetching files. Please try again later.');
    }
  }

  // Function to download a file
  async function downloadFile(id) {
    try {
      const response = await fetch(`https://parkison-data-collection.glitch.me/download/${id}`);
      const blob = await response.blob();

      // Create a download link for the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'file_name.extension'; // Specify the desired file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again later.');
    }
  }

  // Delete an individual file
  async function deleteFile(id) {
    try {
      const response = await fetch(`https://parkison-data-collection.glitch.me/delete/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.message === 'File deleted successfully.') {
        fetchFiles();
        alert('File deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again later.');
    }
  }

  // Delete all files
  deleteAllBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('https://parkison-data-collection.glitch.me/delete/all', { method: 'DELETE' });
      const data = await response.json();
      if (data.message === 'All files deleted successfully.') {
        fetchFiles();
        alert('All files deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting all files:', error);
      alert('Error deleting all files. Please try again later.');
    }
  });



  // Handle file upload form submission
  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);
    try {
      const response = await fetch('https://parkison-data-collection.glitch.me/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        fetchFiles();
        alert('File uploaded successfully.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again later.');
    }
  });

  // Initial fetch of uploaded files
  fetchFiles();
});
