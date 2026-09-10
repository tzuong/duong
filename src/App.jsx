import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Modal (Thêm/Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    major: "",
    class_name: "",
    status: "Đang học",
  });

  // Lấy danh sách sinh viên từ Supabase
  const getStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Xử lý thay đổi input trong Form Modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mở Modal Thêm mới
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      major: "",
      class_name: "",
      status: "Đang học",
    });
    setIsModalOpen(true);
  };

  // Mở Modal Chỉnh sửa
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      major: student.major,
      class_name: student.class_name,
      status: student.status,
    });
    setIsModalOpen(true);
  };

  // Lưu thông tin (Thêm hoặc Cập nhật)
  const handleSaveStudent = async (e) => {
    e.preventDefault();

    if (editingStudent) {
      // Cập nhật sinh viên
      const { error } = await supabase
        .from("students")
        .update(formData)
        .eq("id", editingStudent.id);

      if (error) {
        alert("Lỗi khi cập nhật sinh viên: " + error.message);
      } else {
        getStudents();
        setIsModalOpen(false);
      }
    } else {
      // Thêm mới sinh viên
      const { error } = await supabase.from("students").insert([formData]);

      if (error) {
        alert("Lỗi khi thêm sinh viên: " + error.message);
      } else {
        getStudents();
        setIsModalOpen(false);
      }
    }
  };

  // Xóa sinh viên
  const handleDeleteStudent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      const { error } = await supabase.from("students").delete().eq("id", id);

      if (error) {
        alert("Lỗi khi xóa sinh viên: " + error.message);
      } else {
        getStudents();
      }
    }
  };

  // Lọc sinh viên theo ô tìm kiếm
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.major?.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán số liệu thực tế cho Dashboard
  const totalStudents = students.length;
  const cnttStudents = students.filter(
    (s) => s.major && s.major.toLowerCase().includes("công nghệ thông tin")
  ).length;
  const activeStudents = students.filter(
    (s) => s.status === "Đang học"
  ).length;
  const pausedStudents = students.filter(
    (s) => s.status === "Bảo lưu"
  ).length;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div>
          <h1>Quản lý sinh viên của Thuỳ Dương</h1>
          <p>Hệ thống quản lý thông tin sinh viên</p>
        </div>

        <button className="add-btn" onClick={handleOpenAddModal}>
          + Thêm sinh viên
        </button>
      </header>

      {/* Dashboard */}
      <section className="dashboard">
        <div className="card">
          <div className="card-icon">👨‍🎓</div>
          <div>
            <p>Tổng sinh viên</p>
            <h2>{totalStudents}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">💻</div>
          <div>
            <p>Công nghệ thông tin</p>
            <h2>{cnttStudents}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">📚</div>
          <div>
            <p>Đang học</p>
            <h2>{activeStudents}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">⏸️</div>
          <div>
            <p>Bảo lưu</p>
            <h2>{pausedStudents}</h2>
          </div>
        </div>
      </section>

      {/* Student list */}
      <section className="student-section">
        <div className="section-header">
          <div>
            <h2>Danh sách sinh viên</h2>
            <p>Quản lý thông tin sinh viên trong hệ thống</p>
          </div>

          <div className="search-box">
            🔍
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Ngành</th>
                <th>Lớp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="no-result">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>

                    <td>
                      <strong>{student.name}</strong>
                    </td>

                    <td>{student.email}</td>

                    <td>{student.major}</td>

                    <td>{student.class_name}</td>

                    <td>
                      <span
                        className={
                          student.status === "Đang học"
                            ? "status active"
                            : "status pause"
                        }
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="action edit"
                        onClick={() => handleOpenEditModal(student)}
                      >
                        Sửa
                      </button>
                      <button
                        className="action delete"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-result">
                    Không tìm thấy sinh viên
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Form Thêm/Sửa */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {editingStudent ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}
            </h3>
            <form onSubmit={handleSaveStudent}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngành</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lớp</label>
                <input
                  type="text"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="save-btn">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>Student Management System © 2026</p>
      </footer>
    </div>
  );
}

export default App;