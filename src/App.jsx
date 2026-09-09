import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  const students = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an@gmail.com",
      major: "Công nghệ thông tin",
      className: "DCT23A1",
      status: "Đang học",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh@gmail.com",
      major: "Công nghệ thông tin",
      className: "DCT23A2",
      status: "Đang học",
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "cuong@gmail.com",
      major: "Kỹ thuật phần mềm",
      className: "DCT23A1",
      status: "Đang học",
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung@gmail.com",
      major: "Hệ thống thông tin",
      className: "DCT23A3",
      status: "Bảo lưu",
    },
    {
      id: 5,
      name: "Hoàng Văn Minh",
      email: "minh@gmail.com",
      major: "Công nghệ thông tin",
      className: "DCT23A2",
      status: "Đang học",
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.major.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div>
          <h1>Quản lý sinh viên của Thuỳ Dương</h1>
          <p>Hệ thống quản lý thông tin sinh viên</p>
        </div>

        <button className="add-btn">+ Thêm sinh viên</button>
      </header>

      {/* Dashboard */}
      <section className="dashboard">
        <div className="card">
          <div className="card-icon">👨‍🎓</div>
          <div>
            <p>Tổng sinh viên</p>
            <h2>25</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">💻</div>
          <div>
            <p>Công nghệ thông tin</p>
            <h2>18</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">📚</div>
          <div>
            <p>Đang học</p>
            <h2>23</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">⏸️</div>
          <div>
            <p>Bảo lưu</p>
            <h2>2</h2>
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
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>

                  <td>
                    <strong>{student.name}</strong>
                  </td>

                  <td>{student.email}</td>

                  <td>{student.major}</td>

                  <td>{student.className}</td>

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
                    <button className="action edit">Sửa</button>
                    <button className="action delete">Xóa</button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
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

      {/* Footer */}
      <footer>
        <p>Student Management System © 2026</p>
      </footer>
    </div>
  );
}

export default App;