import "./App.css";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [item, setItem] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editID, setEditID] = useState();

  async function getDB() {
    const res = await axios.get(
      "https://react-http-7341c-default-rtdb.firebaseio.com/users.json"
    );

    const allData = res.data;

    let temp = [];

    for (const key in allData) {
      temp.push({
        id: allData[key].id,
        name: allData[key].name,
        parentId: key,
      });
    }
    setItem(temp);
  }
  useEffect(() => {
    getDB();
  }, [deleteItem]);

  async function addUserDb(array) {
    await axios.post(
      "https://react-http-7341c-default-rtdb.firebaseio.com/users.json",

      JSON.stringify(array),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const SubmitInputHandler = (e) => {
    e.preventDefault();
    if (input && !toggle) {
      setItem(
        item.map((elem) => {
          if (elem.parentId === editItem) {
            return { ...elem, name: input };
          }
          return elem;
        })
      );
      setToggle(true);
      setEditItem(false);
    } else {
      const allTodo = { name: input };
      setItem([...item, allTodo]);
      addUserDb(allTodo);
    }
    setInput({ name: " " });
  };
  const handleEditSubmit = async (e) => {
    const data = { name: input };
    e.preventDefault();
    try {
      await axios.put(
        `https://react-http-7341c-default-rtdb.firebaseio.com/users/${editID}.json`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log("error Update user", error);
    }
    setInput({ name: " " });
    getDB();
  };

  const changeInputHandler = (e) => {
    setInput(e.target.value);
  };

  const changeInputHandler1 = (e) => {
    setInput(e.target.value);
  };

  const deleteItems = async (id) => {
    try {
      await axios.delete(
        `https://react-http-7341c-default-rtdb.firebaseio.com/users/${id}.json`
      );
      setDeleteItem((prevState) => !prevState);
    } catch (error) {
      console.log("error delete user", error);
    }
  };

  const updateItems = async (id) => {
    setEditID(id);
    setIsEdit(true);
    let newEdit1 = item.find((elem) => {
      return elem.parentId === id;
    });
    setInput(newEdit1);
    setToggle(false);
    //  setEditItem(id);
  };

  return (
    <>
      <div className="App">
        <div className="container">
          <h1>Todo App</h1>
        </div>

        <div className="form">
          <div className="submit">
            {!isEdit && (
              <form onSubmit={SubmitInputHandler}>
                <input
                  type="text"
                  required="required"
                  placeholder="Enter Name"
                  name="name"
                  onChange={changeInputHandler}
                  value={input.name}
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
          <div className="edit">
            {isEdit && (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  placeholder="Enter Text to edit"
                  name="text"
                  onChange={changeInputHandler1}
                  value={input.name}
                  required="required"
                />

                <button type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              {item.length > 0 && (
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>ACTION</th>
                </tr>
              )}
            </thead>
            <tbody>
              {item.map((elem, index) => {
                return (
                  <tr key={elem.parentId}>
                    <td>{index + 1}</td>
                    <td>{elem.name}</td>

                    <td>
                      <div className="App-btn">
                        <i
                          className="far fa-trash-alt add-btn1"
                          title="Delete Item"
                          onClick={() => deleteItems(elem.parentId)}
                        ></i>
                        <i
                          className="fas fa-edit add-btn1"
                          title="Edit Item"
                          onClick={() => updateItems(elem.parentId)}
                        ></i>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
