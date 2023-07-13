import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";

const TestHolland = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([""]);
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");
  const answerArray = JSON.parse(localStorage.getItem("new_array"));
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}ac/questions/1/200/1`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setQuestions(res.data.data);
      });
    localStorage.setItem("new_array", JSON.stringify([]));
  }, [token]);

  const newArray = [];

  const handleChange = (e) => {
    const index = newArray.findIndex((p) => p.id_question === e.target.id);
    if (index > -1) {
      newArray[index] = { id_question: e.target.id, answer: e.target.value };
    } else {
      newArray.push({ id_question: e.target.id, answer: e.target.value });
    }
  };

  const handleClick = (e) => {
    const tag = e.currentTarget.dataset.tag;
    document.querySelector(`input[id='${tag}'][value='1']`).checked = true;
    const index = newArray.findIndex((p) => p.id_question === tag);
    if (index > -1) {
      newArray[index] = { id_question: tag, answer: "1" };
    } else {
      newArray.push({ id_question: tag, answer: "1" });
    }
  };

  const handleClick2 = (e) => {
    const tag = e.currentTarget.dataset.tag;
    document.querySelector(`input[id='${tag}'][value='0']`).checked = true;
    const index = newArray.findIndex((p) => p.id_question === tag);
    if (index > -1) {
      newArray[index] = { id_question: tag, answer: "0" };
    } else {
      newArray.push({ id_question: tag, answer: "0" });
    }
  };

  const setArray = () => {
    // gabungin answerArray(jawaban lama) sama newArray(jawaban baru)
    const dataArray = newArray.concat(answerArray);
    const filteredArray = dataArray.filter(
      (obj, index) =>
        dataArray.findIndex((item) => item.id_question === obj.id_question) ===
        index
    );
    if (answerArray !== null) {
      localStorage.setItem("new_array", JSON.stringify(filteredArray));
    } else {
      localStorage.setItem("new_array", JSON.stringify(newArray));
    }
  };

  const numbers = answerArray?.map((item) => parseInt(item.id_question));
  const missingItems = (arr, n) => {
    let missingItems = [];
    for (let i = 1; i <= n; i++) if (!arr?.includes(i)) missingItems.push(i);
    return missingItems;
  };
  const missingNumbers = missingItems(numbers, 108);
  console.log(answerArray);

  const handleSubmit = () => {
    setArray();

    const answerArray = JSON.parse(localStorage.getItem("new_array"));
    const numbers = answerArray?.map((item) => parseInt(item.id_question));
    const missingItems = (arr, n) => {
      let missingItems = [];
      for (let i = 1; i <= n; i++) if (!arr?.includes(i)) missingItems.push(i);
      return missingItems;
    };
    const missingNumbers = missingItems(numbers, 108);

    if (answerArray.length === 108) {
      axios
        .post(
          `${process.env.REACT_APP_URL}ac/save_answer/${id}`,
          { data: answerArray },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => {
          navigate(`/closing/${id}`);
          localStorage.removeItem("new_array");
        })
        .catch((err) => {
          alert("failed");
        });
    } else {
      setShow(true);
      window.location.href = `/holland-test/${id}#${Math.min(
        ...missingNumbers
      )}`;
    }
  };

  const handleClose = () => {
    missingNumbers.map((item) => {
      document.getElementById("box_" + item).style.backgroundColor =
        "rgb(246, 47, 47)";
      document.getElementById("box2_" + item).style.backgroundColor =
        "rgb(246, 47, 47)";
    });
    numbers.map((item) => {
      if (item % 2 === 0) {
        document.getElementById("box_" + item).style.backgroundColor =
          "var(--bs-table-bg)";
        document.getElementById("box2_" + item).style.backgroundColor =
          "var(--bs-table-bg)";
      } else {
        document.getElementById("box_" + item).style.backgroundColor =
          "var(--bs-table-striped-bg)";
        document.getElementById("box2_" + item).style.backgroundColor =
          "var(--bs-table-striped-bg)";
      }
    });
    setShow(false);
  };

  return (
    <div className="container p-4 mt-3">
      <p className="fs-3 fw-bold text-center">Holland Test</p>
      <div
        className="card border-0 p-3 shadow-lg mb-3"
        style={{ backgroundColor: "#E8E8E8" }}
      >
        <span className="text-center fw-bold">
          Bacalah setiap pertanyaan di bawah ini. Jika Anda setuju dengan
          pernyataan tersebut, silahkan isi di kolom yang tersedia.
          <br />
          Tidak ada jawaban yang benar atau salah.
        </span>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr className="text-center text-white" style={{backgroundColor:"#AAAAAA"}}>
            <th className="p-3">No.</th>
            <th className="p-3">Pernyataan</th>
            <th className="p-3" width="8%">
              Ya
            </th>
            <th className="p-3" width="8%">
              Tidak
            </th>
          </tr>
        </thead>
        <tbody onChange={handleChange} className="table-light">
          {questions.map((item) => (
            <tr>
              <th scope="row" className="fw-normal text-center p-3">
                {item.id}
              </th>
              <th scope="row" className="fw-normal p-3">
                {item.question}
              </th>
              <td
                data-tag={item.id}
                className="text-center p-3"
                // style={{backgroundColor:"#99DBF5"}}
                id={"box_" + item.id}
                onClick={handleClick}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  id={item.id}
                  name={"question_" + item.id}
                  value="1"
                  required
                />
              </td>
              <td
                data-tag={item.id}
                className="text-center p-3"
                id={"box2_" + item.id}
                onClick={handleClick2}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  id={item.id}
                  name={"question_" + item.id}
                  value="0"
                  required
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn btn-success w-25 float-end mb-3"
        type="submit"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {/* modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <button
            type="button"
            className="btn-close float-end"
            aria-label="Close"
            onClick={handleClose}
          ></button>
          <p className="h4 fw-bold text-center text-danger mt-2">Gagal!</p>
          <p className="text-center">Harap isi yang kosong.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TestHolland;