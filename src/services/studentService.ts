import type { StudentInput, LoginInput, Student } from "../types/student";

const API_URL = "http://localhost:5071/api";

export async function createStudent(student: StudentInput) {
  const response = await fetch(`${API_URL}/StudentDetails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error("Failed to create student");
  }

  return await response.json();
}

export async function updateStudent(
  id: number,
  student: StudentInput,
): Promise<void> {
  const response = await fetch(`${API_URL}/StudentDetails/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error("Failed to update student");
  }
}

export async function deleteStudent(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/StudentDetails/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }
}

export async function loginStudent(login: LoginInput) {
  const response = await fetch(`${API_URL}/Student/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json();
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_URL}/StudentDetails`);

  if (!response.ok) {
    throw new Error("Failed to load students");
  }

  return await response.json();
}