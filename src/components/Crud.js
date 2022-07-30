import React, { useEffect, useState } from "react";

function Crud() {
  const [cID, setCID] = useState();
  const [cName, setCName] = useState("");
  const [contact, setContact] = useState("");
  const [country, setCountry] = useState("");

  const [myData, setMyData] = useState([]);
  const [clicking, setClicking] = useState(false);
  const [editOn, setEditOn] = useState({
    on: false,
    key: "",
  });

  const [editCID, setEditCID] = useState();
  const [editCName, setEditCName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editCountry, setEditCountry] = useState("");

  const url = "http://localhost:2020/customers";

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMyData(data));
  }, [clicking]);

  function created() {
    let data = {
      CustomerID: parseInt(cID),
      CustomerName: cName,
      ContactName: contact,
      Country: country,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => alert(data["sqlMessage"]))
      .catch((err) => console.log(err));
    setClicking((prev) => !prev);
  }

  function deleted(event, key) {
    let target = url + "/" + key;
    console.log(target);
    fetch(target, {
      method: "DELETE",
    });
    setClicking((prev) => !prev);
  }

  function edited(event, key) {
    setEditOn({
      on: true.valueOf,
      key: key,
    });

    const data = myData.find((ele) => ele.CustomerID === key);

    console.log(data);

    setEditCID(data.CustomerID);
    setEditCName(data.CustomerName);
    setEditContact(data.ContactName);
    setEditCountry(data.Country);
  }

  function saved() {
    let target = url + "/" + editOn.key;
    let data = {
      CustomerID: parseInt(editCID),
      CustomerName: editCName,
      ContactName: editContact,
      Country: editCountry,
    };

    fetch(target, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setClicking((prev) => !prev);

    // let changed = false;

    // for (let i = 0; i < myData.length; i++) {
    //   if (myData[i].mobile === editOn.key) {
    //     tmpData.push({
    //       CustomerID: editCID,
    //       CustomerName: editCName,
    //       ContactName: editContact,
    //       Country: editCountry,
    //     });
    //     changed = true;
    //   } else {
    //     tmpData.push(myData[i]);
    //   }
    // }

    setEditOn({
      on: false,
      key: "",
    });
  }

  function cancelled() {
    setEditOn({
      on: false,
      mobile: "",
    });
  }

  function apiCall() {
    setClicking((prev) => !prev);
  }

  return (
    <div>
      <label>
        CustomerID:
        <input onChange={(event) => setCID(event.target.value)} />
      </label>
      <label>
        CustomerName:
        <input onChange={(event) => setCName(event.target.value)} />
      </label>
      <label>
        ContactName:
        <input onChange={(event) => setContact(event.target.value)} />
      </label>
      <label>
        Country:
        <input onChange={(event) => setCountry(event.target.value)} />
      </label>

      <button onClick={created}>create</button>

      <table>
        <tr>
          <th>CustomerID</th>
          <th>CustomerName</th>
          <th>ContactName</th>
          <th>Country</th>
          <th>Delete</th>
          <th>Edit</th>
        </tr>

        {myData.map((ele) => (
          <tr key={ele.CustomerID}>
            <td>{ele.CustomerID}</td>
            <td>{ele.CustomerName}</td>
            <td>{ele.ContactName}</td>
            <td>{ele.Country}</td>
            <td>
              <button
                onClick={(event) => deleted(event, ele.CustomerID)}
                key={ele.CustomerID}
              >
                delete
              </button>
            </td>
            <td>
              <button
                onClick={(event) => edited(event, ele.CustomerID)}
                key={ele.CustomerID}
              >
                edit
              </button>
            </td>
          </tr>
        ))}
      </table>
      <br />
      {editOn.on && (
        <div>
          <label>
            CustomerID:
            <input
              value={editCID}
              onChange={(event) => setEditCID(event.target.value)}
            />
          </label>
          <label>
            CustomerName:
            <input
              value={editCName}
              onChange={(event) => setEditCName(event.target.value)}
            />
          </label>
          <label>
            ContactName:
            <input
              value={editContact}
              onChange={(event) => setEditContact(event.target.value)}
            />
          </label>
          <label>
            Country:
            <input
              value={editCountry}
              onChange={(event) => setEditCountry(event.target.value)}
            />
          </label>
          <button onClick={saved}>change</button>
          <button onClick={cancelled}>cancel</button>
        </div>
      )}
      <div>{/* <button onClick={apiCall}>call me</button> */}</div>
    </div>
  );
}

export default Crud;
