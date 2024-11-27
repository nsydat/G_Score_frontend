import React, { useState } from "react";
import { Table, Button, Card, notification } from "antd";

interface Student {
  id: number;
  sbd: string;
  toan: number | null;
  ngu_van: number | null;
  ngoai_ngu: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  sinh_hoc: number | null;
  lich_su: number | null;
  dia_li: number | null;
  gdcd: number | null;
  ma_ngoai_ngu: string | null;
}

const StudentSearch: React.FC = () => {
  const [sbd, setSbd] = useState<string>("");
  const [data, setData] = useState<Student[]>([]);
  const [topStudents, setTopStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [topLoading, setTopLoading] = useState<boolean>(false);

  const fetchStudent = () => {
    if (!sbd) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập số báo danh.",
      });
      return; 
    }

    setLoading(true);
    fetch(`https://localhost:44379/api/Student/${sbd}`)
      .then((res) => res.json())
      .then((result) => {
        if (result === null || result.sbd === undefined) {
          notification.error({
            message: "Không tìm thấy sinh viên",
            description: `Không tìm thấy sinh viên với số báo danh ${sbd}.`,
          });
        } else {
          setData([result]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: "Lỗi khi tìm kiếm",
          description: "Đã có lỗi xảy ra khi tìm kiếm sinh viên.",
        });
        setLoading(false);
      });
  };

  const fetchTopStudents = () => {
    setTopLoading(true);
    fetch("https://localhost:44379/api/Student/TopAStudents")
      .then((res) => res.json())
      .then((result) => {
        const formattedData = result.map((student: any) => ({
          ...student,
        }));
        setTopStudents(formattedData);
        setTopLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTopStudents([]);
        setTopLoading(false);
      });
  };

  const columns = [
    {
      title: "Số Báo Danh",
      dataIndex: "sbd",
      key: "sbd",
    },
    {
      title: "Toán",
      dataIndex: "toan",
      key: "toan",
    },
    {
      title: "Ngữ Văn",
      dataIndex: "ngu_van",
      key: "ngu_van",
    },
    {
      title: "Ngoại Ngữ",
      dataIndex: "ngoai_ngu",
      key: "ngoai_ngu",
    },
    {
      title: "Mã Ngoại Ngữ",
      dataIndex: "ma_ngoai_ngu",
      key: "ma_ngoai_ngu",
    },
    {
      title: "Vật Lý",
      dataIndex: "vat_li",
      key: "vat_li",
    },
    {
      title: "Hóa Học",
      dataIndex: "hoa_hoc",
      key: "hoa_hoc",
    },
    {
      title: "Sinh Học",
      dataIndex: "sinh_hoc",
      key: "sinh_hoc",
    },
    {
      title: "Lịch Sử",
      dataIndex: "lich_su",
      key: "lich_su",
    },
    {
      title: "Địa Lý",
      dataIndex: "dia_li",
      key: "dia_li",
    },
    {
      title: "GDCD",
      dataIndex: "gdcd",
      key: "gdcd",
    },
  ];

  return (
    <div>
      <h1>Tra Cứu Điểm Học Sinh</h1>
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={sbd}
          placeholder="Nhập số báo danh"
          onChange={(e) => setSbd(e.target.value)}
          style={{ marginRight: "8px", padding: "8px" }}
        />
        <Button type="primary" onClick={fetchStudent}>
          Tìm
        </Button>

        <Button
          type="primary"
          onClick={fetchTopStudents}
          loading={topLoading}
          style={{ marginLeft: "8px" }}
        >
          Top 10 Học Sinh Khối A
        </Button>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record) => record.id.toString()}
        loading={loading}
        bordered
      />

      {topStudents.length > 0 && (
        <Card title="Top 10 Học Sinh Khối A">
          <Table
            dataSource={topStudents}
            columns={columns}
            rowKey={(record) => record.id.toString()}
            bordered
          />
        </Card>
      )}
    </div>
  );
};

export default StudentSearch;
