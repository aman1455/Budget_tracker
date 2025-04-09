import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
import { BiSolidBellRing } from "react-icons/bi";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [GoalExpense, setGoalExpense] = useState({});
  const [AllGols, setSetAllGols] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  const [editable2, setEditable2] = useState(false);

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Refrence",
      dataIndex: "refrence",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable2(true);
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  //getall transactions
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post(`${process.env.REACT_APP_NODE_URL}api/v1/transections/get-transection`, {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setAllTransection(res.data);
        setLoading(false);
      } catch (error) {
        message.error("Ftech Issue With Tranction");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type, reload]);

  //get gols
  useEffect(() => {
    const getAllGols = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(`${process.env.REACT_APP_NODE_URL}api/v1/budgets/get-budget/${user._id}`)
        setSetAllGols(res.data);
      } catch (error) {
        message.error("Ftech Issue With Gol");
      }
    };
    getAllGols();
  }, []);

  //get expenses goal wise
  useEffect(() => {
    const getExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(`${process.env.REACT_APP_NODE_URL}api/v1/budgets/get-expense/${user._id}`);
        console.log(res.data);
        setGoalExpense(res.data);
      } catch (error) {
        message.error("Ftech Issue With Expenses");
      }
    };
    getExpenses();
  }, []);

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_NODE_URL}api/v1/transections/delete-transection`, {
        transacationId: record._id,
      });
      setLoading(false);
      setReload(!reload);
      message.success("Transaction Deleted!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("unable to delete");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post(`${process.env.REACT_APP_NODE_URL}api/v1/transections/edit-transection`, {
          payload: {
            ...values,
            userId: user._id,
          },
          transacationId: editable._id,
        });
        setReload(!reload);
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post(`${process.env.REACT_APP_NODE_URL}api/v1/transections/add-transection`, {
          ...values,
          userid: user._id,
        });
        setReload(!reload);
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("please fill all fields");
    }
  };

  
  const handleSubmit2 = async (values) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log({...values, userId: user._id});
    try {
      setLoading(true);
      if (editable) {
        await axios.post(`${process.env.REACT_APP_NODE_URL}api/v1/budgets/add-budget`, {
          payload: {
            ...values,
            userId: user._id,
          },
        });
        setReload(!reload);
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post(`${process.env.REACT_APP_NODE_URL}api/v1/budgets/add-budget`, {
          ...values,
          userId: user._id,
        });
        setReload(!reload);
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("please fill all fields");
    }
  };

  const dailyGols = AllGols.filter((item) => item.type === "daily");
  const weeklyGols = AllGols.filter((item) => item.type === "weekly");
  const monthlyGols = AllGols.filter((item) => item.type === "monthly");

  const TodayExpense = GoalExpense?.expensesToday?.reduce((acc, item) => acc + item.amount, 0);
  const WeeklyExpense = GoalExpense?.expensesWeekly?.reduce((acc, item) => acc + item.amount, 0);
  const MonthlyExpense = GoalExpense?.expensesYearly?.reduce((acc, item) => acc + item.amount, 0);
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="home-page">
        <div className="filters">
          <div>
            <h6>Select Frequency</h6>
            <Select value={frequency} onChange={(values) => setFrequency(values)}>
              <Select.Option value="7">LAST 1 Week</Select.Option>
              <Select.Option value="30">LAST 1 Month</Select.Option>
              <Select.Option value="365">LAST 1 year</Select.Option>
              <Select.Option value="custom">custom</Select.Option>
            </Select>
            {frequency === "custom" && (
              <RangePicker
                value={selectedDate}
                onChange={(values) => setSelectedate(values)}
              />
            )}
          </div>
          <div className="filter-tab ">
            <h6>Select Type</h6>
            <Select value={type} onChange={(values) => setType(values)}>
              <Select.Option value="all">ALL</Select.Option>
              <Select.Option value="income">INCOME</Select.Option>
              <Select.Option value="expense">EXPENSE</Select.Option>
            </Select>
          </div>
          <div className="switch-icons">
            <UnorderedListOutlined
              className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"
                }`}
              onClick={() => setViewData("table")}
            />
            <AreaChartOutlined
              className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"
                }`}
              onClick={() => setViewData("analytics")}
            />
          </div>
          <div>
            <button
              className="btn bg-[#6A5ACD]"
              onClick={() =>{setEditable(false); setShowModal(true)}}
            >
              Add New
            </button>
          </div>
        </div>
        <div className="content">
          {viewData === "table" ? (
            <Table columns={columns} dataSource={allTransection} />
          ) : (
            <Analytics allTransection={allTransection} />
          )}
        </div>
{console.log("data", editable2)}
        <div className="goals-content">
          <div className="goals mt-4">
            <div> <h4 className="!text-[#6a5acd]">Budget Goals</h4></div>
            <button className="btn" onClick={() => setShowModal2(true)}>Add Goals</button>
          </div>
          <div className="goals-head mt-3">
            <div>
              <div className="card extrude" style={{ position: "relative" }}>
                {dailyGols[0]?.amount - TodayExpense < 500 &&
                  <div style={{ width: "100%", display: "flex", justifyContent: "end", position: "absolute", top: "0", right: "0" }}>
                    <div>
                      <BiSolidBellRing style={{ color: TodayExpense > dailyGols[0]?.amount ? "red" : "#6a5acd", fontSize: "20px" }} /></div>

                  </div>}
                  {
                    dailyGols[0]?.amount ?
                     <>
                      <h5>Daily Budget Goal is<span style={{ color: "#198754" }}> {dailyGols[0]?.amount}</span>  </h5>
                      Your Current Daily Expense<span style={{ color: "#198754" }}>{TodayExpense}</span>
                     </>
                     :
                      <>
                        <h5>You have not set a daily budget goal</h5>
                      </>
                  }
               
              </div>
            </div>
            <div>
              <div className="card extrude" style={{ position: "relative" }}>
                {weeklyGols[0]?.amount - WeeklyExpense < 500 &&
                  <div style={{ width: "100%", display: "flex", justifyContent: "end", position: "absolute", top: "0", right: "0" }}>
                    <div>
                      <BiSolidBellRing style={{ color: WeeklyExpense > weeklyGols[0]?.amount ? "red" : "#6a5acd", fontSize: "20px" }} /></div>

                  </div>}
                  {
                    weeklyGols[0]?.amount ?
                     <>
                      <h5>Daily Budget Goal is<span style={{ color: "#198754" }}> {weeklyGols[0]?.amount}</span>  </h5>
                      Your Current Daily Expense<span style={{ color: "#198754" }}>{WeeklyExpense}</span>
                     </>
                     :
                      <>
                        <h5>You have not set a daily budget goal</h5>
                      </>
                  }
              </div>
            </div>
            <div>
              <div className="card extrude" style={{ position: "relative" }}>
                {monthlyGols[0]?.amount - MonthlyExpense < 500 &&
                  <div style={{ width: "100%", display: "flex", justifyContent: "end", position: "absolute", top: "0", right: "0" }}>
                    <div>
                      <BiSolidBellRing style={{ color: MonthlyExpense > monthlyGols[0]?.amount ? "red" : "#6a5acd", fontSize: "20px" }} /></div>

                  </div>}
                  {
                    monthlyGols[0]?.amount ?
                     <>
                      <h5>Daily Budget Goal is<span style={{ color: "#198754" }}> {monthlyGols[0]?.amount}</span>  </h5>
                      Your Current Daily Expense<span style={{ color: "#198754" }}>{MonthlyExpense}</span>
                     </>
                     :
                      <>
                        <h5>You have not set a daily budget goal</h5>
                      </>
                  }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transection"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Refrence" name="refrence">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" required />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={editable2 ? "Edit Goals" : "Add Goals"}
        open={showModal2}
        onCancel={() => setShowModal2(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit2}
          initialValues={editable2}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="number" required />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="daily" disabled={dailyGols[0]?.amount}>Daily</Select.Option>
              <Select.Option value="weekly" disabled={weeklyGols[0]?.amount}>Weekly</Select.Option>
              <Select.Option value="monthly" disabled={monthlyGols[0]?.amount}>Monthly</Select.Option>
            </Select>
          </Form.Item>
        
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
