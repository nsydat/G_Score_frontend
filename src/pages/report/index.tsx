import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, List, Radio } from 'antd';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, Legend, Pie, PieChart, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ScoreDashboard: React.FC = () => {
  const [barData, setBarData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('toan'); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('https://localhost:44379/api/Student/ScoreStatistics')
      .then((res) => res.json())
      .then((result) => {
        // Chuẩn hóa dữ liệu cho BarChart
        const formattedBarData = result.map((item: any) => ({
          subject: item.subject,
          '>= 8 điểm': item.level1,
          '6 - 8 điểm': item.level2,
          '4 - 6 điểm': item.level3,
          '< 4 điểm': item.level4,
        }));
        setBarData(formattedBarData);

        // Chuẩn hóa dữ liệu cho từng môn học để dùng trong PieChart
        const formattedStatistics = result.map((item: any) => ({
          subject: item.subject,
          data: [
            { name: '>= 8 điểm', value: item.level1 },
            { name: '6 - 8 điểm', value: item.level2 },
            { name: '4 - 6 điểm', value: item.level3 },
            { name: '< 4 điểm', value: item.level4 },
          ],
        }));
        setStatistics(formattedStatistics);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Lấy dữ liệu PieChart cho môn học được chọn
  const pieData = statistics
    .find((stat) => stat.subject === selectedSubject)?.data || [
    { name: '>= 8 điểm', value: 0 },
    { name: '6 - 8 điểm', value: 0 },
    { name: '4 - 6 điểm', value: 0 },
    { name: '< 4 điểm', value: 0 },
  ];

  return (
    <Row gutter={[20, 20]}>
      {/* Biểu đồ BarChart */}
      <Col span={24}>
        <Card loading={loading} title="Thống Kê Điểm Theo Môn Học">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <XAxis dataKey="subject" />
              <Tooltip />
              <Legend />
              <Bar dataKey=">= 8 điểm" stackId="a" fill="#0088FE" />
              <Bar dataKey="6 - 8 điểm" stackId="a" fill="#00C49F" />
              <Bar dataKey="4 - 6 điểm" stackId="a" fill="#FFBB28" />
              <Bar dataKey="< 4 điểm" stackId="a" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      {/* Biểu đồ PieChart */}
      <Col span={24}>
        <Card
          loading={loading}
          title="Tỷ Lệ Số Lượng Học Sinh Theo Mức Điểm"
          extra={
            <Radio.Group
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {statistics.map((stat) => (
                <Radio.Button key={stat.subject} value={stat.subject}>
                  {stat.subject}
                </Radio.Button>
              ))}
            </Radio.Group>
          }
        >
          <Row gutter={20}>
            <Col span={12}>
              <ResponsiveContainer height={300}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {pieData.map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Col>
            <Col span={12}>
              <List
                dataSource={pieData}
                renderItem={(item: { name: string; value: number }, index: number) => (
                  <List.Item>
                    <Badge color={COLORS[index]} /> {item.name}: {item.value}
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ScoreDashboard;
