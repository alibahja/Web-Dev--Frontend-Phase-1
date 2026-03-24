import React from "react";

const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", status: "Available" },
  { id: 2, title: "1984", author: "George Orwell", status: "Borrowed" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", status: "Available" },
  { id: 4, title: "Moby Dick", author: "Herman Melville", status: "Borrowed" },
];

function Admin() {
  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(17,24,39,0.75), rgba(17,24,39,0.85)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <section className="text-center text-white mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Library Administration
          </h1>
          <p className="text-lg opacity-90">
            Manage books, users, and borrowing activity with elegance and control.
          </p>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Books", value: "1,248" },
            { label: "Total Users", value: "356" },
            { label: "Borrowed Books", value: "142" },
            { label: "Overdue", value: "18" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/95 rounded-2xl p-6 shadow-lg text-center hover:scale-[1.02] transition"
            >
              <h3 className="text-sm text-blue-900 mb-2 font-semibold">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* ACTIONS */}
        <section className="flex flex-wrap justify-center gap-4 mb-10">
          {["Add Book", "Manage Users", "View Reports"].map((action, i) => (
            <button
              key={i}
              className="px-6 py-3 bg-blue-900 text-white rounded-full font-medium transition-all hover:bg-blue-600 hover:-translate-y-1 active:scale-95"
            >
              {action}
            </button>
          ))}
        </section>

        {/* TABLE SECTION */}
        <section className="bg-white/95 rounded-3xl p-6 shadow-xl">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-blue-900">
              Book Management
            </h2>

            <input
              type="text"
              placeholder="Search books..."
              className="px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-800 w-full md:w-[260px]"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 text-sm">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Author</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-2">{book.id}</td>
                    <td className="py-3 px-2 font-medium">{book.title}</td>
                    <td className="py-3 px-2">{book.author}</td>

                    {/* STATUS */}
                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          book.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-2">
                      <button className="px-3 py-1 mr-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        Delete
                      </button>
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
