import React, { useState, useEffect } from 'react';
import { Client, Databases, Account } from 'appwrite';

const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '669f7ccb001ee4eee52f',
  databaseId: '669f83c50009eaba4c4f',
  userCollectionId: '669f841a002339570792',
  videoCollectionId: '669f846d0024f4d446cf',
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);
const account = new Account(client);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId
      );
      const formattedUsers = result.documents.map(user => ({
        ...user,
        joinedDate: user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Check console for details.');
    }
  };

  const fetchPosts = async () => {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId
      );
      setPosts(result.documents || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Check console for details.');
    }
  };

  const deleteUser = async (userId) => {
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          userId
        );
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Check console for details.');
    }
  };

  const deletePost = async (postId) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.videoCollectionId,
          postId
        );
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Check console for details.');
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setNewUsername(user.username);
    setNewEmail(user.email);
  };

  const saveEdit = async () => {
    if (editingUser) {
      try {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          editingUser.$id,
          {
            username: newUsername,
            email: newEmail
          }
        );
        setEditingUser(null);
        fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
        setError('Failed to update user. Check console for details.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.location.reload(); // Reload the page to redirect to the login page or home page
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out. Check console for details.');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        <section className="user-section">
          <h2>Users List</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.$id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.joinedDate || 'N/A'}</td>
                    <td>
                      <button className="edit-button" onClick={() => startEditing(user)}>Edit</button>
                      <button className="delete-button" onClick={() => deleteUser(user.$id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {editingUser && (
          <section className="edit-user-section">
            <h2>Edit User</h2>
            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
              <label>
                Username:
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
              </label>
              <label>
                Email:
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </label>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
            </form>
          </section>
        )}

        <section className="post-section">
          <h2>Posts List</h2>
          <table className="post-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.$id}>
                    <td>{post.title}</td>
                    <td>{post.users.username}</td>
                    <td>
                      <button className="delete-button" onClick={() => deletePost(post.$id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
