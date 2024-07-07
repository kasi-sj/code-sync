<h1 align="center" id="title">CodeSync Project</h1>
<p id="description">  CodeCollab is a comprehensive project that includes a feature-rich code editor, designed to offer functionalities similar to VS Code. The project encompasses a robust set of features, including editing, opening, listing, creating, managing, and saving files and folders. Additionally, it integrates a basic terminal. The standout feature of CodeCollab is its collaborative editing capability, which leverages socket.io for real-time communication, allowing multiple users to work on the same codebase simultaneously.
</p>


## DeskTop Application

<table>
  <tr>
    <td><img src="https://github.com/kasi-sj/code-sync/assets/110708280/65d70e0d-df5d-44ab-9cac-833b196d3e27" alt="Screenshot 1" ></td>
    <td><img src="https://github.com/kasi-sj/code-sync/assets/110708280/8a18dbd2-56a7-4e19-bb7a-dae9c98c5946" alt="Screenshot 2" ></td>
  </tr>
  <tr>
    <td><img src="https://github.com/kasi-sj/code-sync/assets/110708280/337d8a7b-c23c-4170-8246-3319eb9a6d9f" alt="Screenshot 3" ></td>
    <td><img src="https://github.com/kasi-sj/code-sync/assets/110708280/f43dd2d0-65ff-49c4-9b5b-e1d4a2eed38b" alt="Screenshot 4" ></td>
  </tr>
  <tr>
    <td colspan="2" style="text-align:center;"><img src="https://github.com/kasi-sj/code-sync/assets/110708280/f62b99b4-728f-478c-9e17-7e4a984f5aaa" alt="Screenshot 5" ></td>
  </tr>
</table>

<h2>🧐 Features</h2>
<ul>
  <li><strong>Open Files:</strong> Easily open existing files for viewing and editing.</li>
  <li><strong>List Files and Folders:</strong> Browse and navigate your project directory structure seamlessly.</li>
  <li><strong>Create Files and Folders:</strong> Quickly create new files and folders within your project.</li>
  <li><strong>Edit Files:</strong> Provides a rich text editor for coding with syntax highlighting and code completion.</li>
  <li><strong>Save Files:</strong> Save your work with a simple keystroke or button click.</li>
  <li><strong>Manage Files and Folders:</strong> Rename, move, and delete files and folders as needed.</li>
  <li><strong>Basic Terminal:</strong> Includes a basic terminal for running commands within the editor.</li>
  <li><strong>Collaborative Editing:</strong> Real-time collaborative editing using socket.io, allowing multiple users to work on the same codebase simultaneously.</li>
</ul>


<h2>📁 Project Structure</h2>

This repository consists of three main components:

    Backend: Built with Ruby on Rails (user authentication and management)
    Frontend: Built with Next.js 
    Desktop: Built with Tauri (system API's)
<p>The backend for user management in CodeCollab is reused from another project. For detailed information about the backend implementation, please refer to the <a href="https://github.com/kasi-sj/TrackMe/blob/main/track-me-backend/README.md">Backend README</a> of the original project.</p>

<h2>🛠️ Built With</h2>

Technologies used in the project:

    Backend: Ruby on Rails, PostgreSQL
    Frontend: Next.js, Tailwind CSS, Next UI , monaco-editor , primereact terminal
    Desktop: Tauri

<h2>🔧 Backend Implementation</h2>
<ul>
  <li><strong>Operation Transformation:</strong> Ensures consistency of edits made by multiple users in real-time using server_version and client_version, allowing for smooth collaborative editing.</li>
  <li><strong>Cursor Management:</strong> Tracks and updates cursor positions for all users, providing a seamless collaborative experience.</li>
  <li><strong>Socket Channel:</strong> Utilizes socket channels for sending and receiving updates efficiently.</li>
  <li><strong>Architecture:</strong> 
    <ul>
      <li>Multiple users connect to a single server (root server) that acts as the single source of truth.</li>
      <li>The root server sends updates to all connected users, ensuring consistency.</li>
      <li>Socket.io is used for managing connections and real-time communication.</li>
    </ul>
  </li>
  <li><strong>File Management Channels:</strong> 
    <ul>
      <li>A single channel is created by the host (root server) for overall file management.</li>
      <li>Separate channels are created by the host for each file that is in editing mode, allowing for focused updates and edits.</li>
    </ul>
  </li>
  <li><strong>Terminal Integration:</strong> The terminal is connected by running system commands through a Rust API. Input and output streams are transferred from the frontend to the backend, enabling seamless command execution.</li>
</ul>


### 📥 Download

You can download the latest version of CodeCollab from the [releases page](https://github.com/kasi-sj/code-sync/releases/tag/v1.0.1).



<h2>💖 Like My Work?</h2>

Give this repo a star ⭐
