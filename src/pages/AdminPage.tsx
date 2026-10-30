import { useEffect, useState } from "react";
import type { Student } from "../types/student";
import { deleteStudent, getStudents } from "../services/studentService";
import StudentForm from "../components/StudentForm";
import { StudentTable } from "../components/StudentTable";

function AdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load students",
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      setError(null);
      await loadStudents();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete student",
      );
    }
  };

  useEffect(() => {
    let isCurrent = true;

    getStudents()
      .then((data) => {
        if (isCurrent) {
          setStudents(data);
          setError(null);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load students",
          );
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <main className="admin-page">
      <header className="page-header">
        <p className="eyebrow">STUDENT MANAGEMENT</p>
        <h1>Student Records</h1>
        <p className="page-subtitle">A little order goes a long way.</p>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <section className="paper-card form-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE FORM</p>
            <h2>{editingStudent ? "Edit student" : "Add a student"}</h2>
          </div>
          <span className="record-count">{students.length} RECORDS</span>
        </div>
        <StudentForm
          key={editingStudent?.id ?? "new-student"}
          editingStudent={editingStudent}
          onCancelEdit={() => setEditingStudent(null)}
          onError={setError}
          onSaved={() => {
            setEditingStudent(null);
            void loadStudents();
          }}
        />
      </section>

      <section className="paper-card table-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE ROSTER</p>
            <h2>All students</h2>
          </div>
        </div>
        <StudentTable
          students={students}
          onDelete={handleDelete}
          onEdit={setEditingStudent}
        />
      </section>
    </main>
  );
}
export default AdminPage;
