FileVault is a web-based file-sharing platform where users can create a room with a unique ID, upload files, and share access with others using the room code. The files remain stored until manually deleted.

🌟 Features
Room-based File Sharing: Users can create and join rooms using a unique room ID.
Secure Storage: Files are stored securely on the server and are accessible only to those with the room code.
Simple UI: A user-friendly interface for seamless file sharing.
🛠️ Tech Stack
Frontend: React, Tailwind CSS
Backend: Node.js, Express.js, MongoDB
Hosting: Hostinger for the server and file storage
🚀 How to Run Locally
Clone the repository:

bash
Copy code
git clone https://github.com/ShubhanshuPandey05/FileVault.git
Navigate to the project directory:

bash
Copy code
cd FileVault
Install dependencies:

bash
Copy code
npm install
Set up environment variables in a .env file:

env
Copy code
PORT=5000
MONGO_URI=your_mongo_db_connection_string
FTP_HOST=your_ftp_host
FTP_USER=your_ftp_username
FTP_PASSWORD=your_ftp_password
Start the server:

bash
Copy code
npm start
Access the app at http://localhost:5000.

📄 License
This project is open-source under the MIT License. Feel free to contribute!
