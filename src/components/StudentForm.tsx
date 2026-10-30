import { useState } from "react";
import type { Student, StudentInput } from "../types/student";
import { createStudent, updateStudent } from "../services/studentService";

interface StudentFormProps {
  editingStudent: Student | null;
  onCancelEdit: () => void;
  onError: (message: string | null) => void;
  onSaved: () => void;
}

const initialStudent: StudentInput = {
  name: "",
  email: "",
  course: "",
  year: "",
  status: "Active",
};

function StudentForm({
  editingStudent,
  onCancelEdit,
  onError,
  onSaved,
}: StudentFormProps) {
  const [student, setStudent] = useState<StudentInput>(() => {
    if (!editingStudent) {
      return initialStudent;
    }

    const { name, email, course, year, status } = editingStudent;
    return { name, email, course, year, status };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onError(null);

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, student);
      } else {
        await createStudent(student);
      }

      setStudent(initialStudent);
      onSaved();
    } catch (requestError) {
      onError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to save student",
      );
    }
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="name"
          placeholder="e.g. Alex Morgan"
          value={student.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          placeholder="alex@example.com"
          value={student.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Course
        <input
          name="course"
          placeholder="e.g. Computer Science"
          value={student.course}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Year
        <input
          name="year"
          placeholder="e.g. 2"
          value={student.year}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Status
        <input
          name="status"
          placeholder="Active"
          value={student.status}
          onChange={handleChange}
          required
        />
      </label>
      <div className="form-actions">
        <button className="button button-green" type="submit">
          {editingStudent ? "Update Student" : "Create Student"}
        </button>
        {editingStudent && (
          <button
            className="button button-neutral"
            type="button"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentForm;
