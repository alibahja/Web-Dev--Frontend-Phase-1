import React from "react";
import "./Admin.css";

const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", status: "Available" },
  { id: 2, title: "1984", author: "George Orwell", status: "Borrowed" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", status: "Available" },
  { id: 4, title: "Moby Dick", author: "Herman Melville", status: "Borrowed" },
];

function Admin() {
  return (
    <div className="admin-page">
      <div className="admin-overlay">
        <section className="admin-hero">
          <h1>Library Administration</h1>
          <p>Manage books, users, and borrowing activity with elegance and control.</p>
        </section>

        <section className="admin-stats">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p>1,248</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>356</p>
          </div>
          <div className="stat-card">
            <h3>Borrowed Books</h3>
            <p>142</p>
          </div>
          <div className="stat-card">
            <h3>Overdue</h3>
            <p>18</p>
          </div>
        </section>

        <section className="admin-actions">
          <button>Add Book</button>
          <button>Manage Users</button>
          <button>View Reports</button>
        </section>

        <section className="admin-table-section">
          <div className="table-header">
            <h2>Book Management</h2>
            <input type="text" placeholder="Search books..." />
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                      <span
                        className={
                          book.status === "Available"
                            ? "status available"
                            : "status borrowed"
                        }
                      >
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <button className="small-btn">Edit</button>
                      <button className="small-btn delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;