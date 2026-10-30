import type { Student } from "../types/student";

interface StudentTableProps {
  students: Student[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (student: Student) => void;
}

export function StudentTable({ students, onDelete, onEdit }: StudentTableProps) {
  const handleDelete = async (student: Student) => {
    if (window.confirm(`Delete ${student.name}? This cannot be undone.`)) {
      await onDelete(student.id);
    }
  };

  return (
    <div className="table-scroll">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td className="empty-row" colSpan={6}>
                No students yet. Add one using the form above.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.year}</td>
                <td>
                  <span className="status-badge">{student.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="button button-small button-red"
                      type="button"
                      onClick={() => onEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-small button-red"
                      type="button"
                      onClick={() => void handleDelete(student)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
