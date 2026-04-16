import { SetStateAction, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    }
  };

  const toggleEdit = (id: string, username: string, email: string) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id: string) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      toast.success("User updated successfully");
      setEditableUserId(null);
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message);
    }
  };

  const cancelEdit = () => {
    setEditableUserId(null);
  };

  const totalPages = Math.ceil((users?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = users?.slice(startIndex, endIndex) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-muted to-surface-subtle p-6">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {(error as any)?.data?.message ||
              (error as any)?.error ||
              "An error occurred"}
          </Message>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-text-primary mb-2">
                Manage Users
              </h1>
              <p className="text-text-secondary">
                Edit or delete user accounts • Total Users:{" "}
                <span className="font-semibold">{users?.length || 0}</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-border text-text-primary border-b border-border-dark">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        User ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Admin
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedUsers && paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-surface-muted transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono text-text-secondary">
                              {user._id.substring(0, 12)}...
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {editableUserId === user._id ? (
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={editableUserName}
                                  onChange={(e) =>
                                    setEditableUserName(e.target.value)
                                  }
                                  className="flex-1 px-3 py-2 border border-border-dark rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-text-primary">
                                  {user.username}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editableUserId === user._id ? (
                              <div className="flex gap-2 items-center">
                                <input
                                  type="email"
                                  value={editableUserEmail}
                                  onChange={(e) =>
                                    setEditableUserEmail(e.target.value)
                                  }
                                  className="flex-1 px-3 py-2 border border-border-dark rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                              </div>
                            ) : (
                              <a
                                href={`mailto:${user.email}`}
                                className="text-pink-600 hover:underline"
                              >
                                {user.email}
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {user.isAdmin ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-light text-amber-dark">
                                <FaCheck className="mr-1" /> Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-subtle text-text-primary">
                                <FaTimes className="mr-1" /> User
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center flex-wrap">
                              {editableUserId === user._id ? (
                                <>
                                  <button
                                    onClick={() => updateHandler(user._id)}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber to-amber hover:from-amber hover:to-amber-dark text-white rounded-lg font-semibold transition-colors text-sm"
                                  >
                                    <FaCheck className="mr-1" /> Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="inline-flex items-center px-4 py-2 bg-border-dark hover:bg-text-subtle text-text-primary rounded-lg font-semibold transition-colors text-sm"
                                  >
                                    <FaTimes className="mr-1" /> Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      toggleEdit(
                                        user._id,
                                        user.username,
                                        user.email,
                                      )
                                    }
                                    className="inline-flex items-center px-4 py-2 bg-primary-light hover:bg-primary text-white rounded-lg font-semibold transition-colors text-sm"
                                  >
                                    <FaEdit className="mr-1" /> Edit
                                  </button>
                                  <button
                                    onClick={() => deleteHandler(user._id)}
                                    disabled={user.isAdmin}
                                    className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                                      user.isAdmin
                                        ? "bg-border-dark text-text-secondary cursor-not-allowed"
                                        : "bg-danger hover:bg-danger-light text-white"
                                    }`}
                                  >
                                    <FaTrash className="mr-1" /> Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-text-secondary"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {users && users.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between px-6 py-4 bg-surface-muted border-t border-border">
                  <div className="text-sm text-text-secondary">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, users.length)} of {users.length} users
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                        currentPage === 1
                          ? "bg-border text-text-subtle cursor-not-allowed"
                          : "bg-primary-light hover:bg-primary text-white"
                      }`}
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                              currentPage === page
                                ? "bg-primary text-white"
                                : "bg-border text-text-primary hover:bg-border-dark"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                        currentPage === totalPages
                          ? "bg-border text-text-subtle cursor-not-allowed"
                          : "bg-primary-light hover:bg-primary text-white"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
