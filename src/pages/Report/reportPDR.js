import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import { Row } from "react-bootstrap";
import { Radar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import logo from "../../assets/Logo Assesment Center-06.png";
import lineTitle from "../../assets/Asset 69.png";
import bgRight from "../../assets/Asset 28.png";

const ReportPDR = () => {
  const [dataReport, setDataReport] = useState("");
  const token = localStorage.getItem("token");
  const componentRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}ac/admin/pdr_summary/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setDataReport(res.data);
      });
  }, []);

  const generatePDF = () => {
    document.getElementById("pdfHidden").style.display = "block";
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4", false);
      pdf.addImage(imgData, "PNG", 0, 0, 600, 0, undefined, false);
      pdf.save("report-digital-readiness.pdf");
    });
    document.getElementById("pdfHidden").style.display = "none";
  };

  const dataRadar = {
    labels: dataReport?.dataRadar?.label,
    datasets: [
      {
        label: "Data",
        data: dataReport?.dataRadar?.data,
        fill: true,
        borderColor: "blue",
      },
      {
        label: "Baseline",
        data: [3.25, 3.25, 3.25, 3.25, 3.25, 3.25],
        borderColor: "red",
        borderDash: [3, 5],
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
    ],
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        r: {
          pointLabels: {
            font: {
              size: 12,
            },
          },
        },
      },
      scale: {
        ticks: {
          beginAtZero: true,
          max: 4,
          min: 0,
          stepSize: 1,
        },
        min: 0,
      },
    },
  };

  return (
    <div className="p-3">
      <button
        className="btn btn-info text-white fw-bold mb-2"
        onClick={generatePDF}
      >
        Export PDF
      </button>
      <div
        id="report"
        className="card border rounded shadow capture"
        ref={componentRef}
      >
        <div id="pdfHidden" style={{ display: "none" }} className="a4">
          <Row>
            <div className="col container p-5 my-auto">
              <div className="d-flex">
                <img
                  className="my-auto p-1"
                  alt=""
                  src={logo}
                  width="auto"
                  height={80}
                ></img>
                <div className="mx-3 fw-bold vr"></div>
                <img
                  className="my-auto p-1"
                  alt=""
                  src={dataReport?.user?.logo_company}
                  width="auto"
                  height={48}
                ></img>
              </div>
              <p
                className="fw-bold text-uppercase mb-0"
                style={{ fontSize: "70px", color: "#213555" }}
              >
                people digital readiness
              </p>
              <p
                className="fw-bold text-uppercase mb-0"
                style={{ fontSize: "55px", color: "#6DA9E4" }}
              >
                Test Report
              </p>
              <img src={lineTitle} height="auto" width="70%" />
              <p className="fw-bold mt-3 fs-4">{dataReport?.user?.fullname}</p>
              <p className="fw-bold mb-0 fs-4">
                Email: {dataReport?.user?.email}
              </p>
              <p className="fw-bold mb-0 fs-4">
                Perusahaan: {dataReport?.user?.name_company}
              </p>
              <p className="fw-bold mb-0 fs-4">
                Jabatan: {dataReport?.user?.jabatan}
              </p>
            </div>
            <div className="col-4">
              <img src={bgRight} height="auto" width="100%" />
            </div>
          </Row>
        </div>
        <div className="rounded" style={{ backgroundColor: "#0E2954" }}>
          <p className="text-center text-uppercase fw-bold mt-2 text-white mb-2">
            data people digital readiness (pdr)
          </p>
        </div>
        <div className="p-2 px-3">
          <p className="fw-bold">Digital Competency:</p>
          <div className="d-flex justify-content-center mt-6">
            <div className="mapping-wrapper">
              <p
                className="text-secondary"
                style={{
                  position: "absolute",
                  left: "-90px",
                  top: "-30px",
                  fontSize: "15px",
                }}
              >
                Digital Competency
              </p>
              <p
                className="text-secondary"
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  right: "-150px",
                  fontSize: "15px",
                }}
              >
                Digital Adaptability
              </p>
              <div class="mapping-grid text-center">
                <div class="col bg-blue text-white border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p>Paradox</p>
                  <p>{dataReport?.dataScatter?.Paradox}</p>
                  <div
                    className="box-left"
                    style={{ backgroundColor: "#2e75b6" }}
                  >
                    <p>High</p>
                  </div>
                </div>
                <div class="col bg-blue text-white border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p>Enabler</p>
                  <p>{dataReport?.dataScatter?.Enabler}</p>
                </div>
                <div class="col bg-blue text-white border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p>Enhancer</p>
                  <p>{dataReport?.dataScatter?.Enhancer}</p>
                </div>
                <div class="col bg-blue text-white border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p>Leader</p>
                  <p>{dataReport?.dataScatter?.Leader}</p>
                </div>
                <div class="text-secondary col bg-light border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p>Comfort Zone</p>
                  <p>{dataReport?.dataScatter?.ComfortZone}</p>
                  <div
                    className="box-left text-secondary"
                    style={{ backgroundColor: "#bdd7ee" }}
                  >
                    <p>Low</p>
                  </div>
                  <div
                    className="box-bottom"
                    style={{ backgroundColor: "#bdd7ee" }}
                  >
                    <p>Personal Innovative</p>
                  </div>
                </div>
                <div class="text-secondary col bg-light border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p>Observer</p>
                  <p>{dataReport?.dataScatter?.Observer}</p>
                  <div
                    className="box-bottom text-secondary"
                    style={{ backgroundColor: "#9dc3e6" }}
                  >
                    <p>Emotional Response</p>
                  </div>
                </div>
                <div class="col bg-light border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p className="text-secondary">Fast Adopter</p>
                  <p className="text-secondary">
                    {dataReport?.dataScatter?.FastAdopter}
                  </p>
                  <div
                    className="box-bottom text-white"
                    style={{ backgroundColor: "#2e75b6" }}
                  >
                    <p>Attitudinal Readiness</p>
                  </div>
                </div>
                <div class="col bg-light border border-white p-4 d-flex flex-column gap-2 justify-content-center position-relative">
                  <p className="text-secondary">Learner</p>
                  <p className="text-secondary">
                    {dataReport?.dataScatter?.Learner}
                  </p>
                  <div
                    className="box-bottom text-white"
                    style={{ backgroundColor: "#1f4e79" }}
                  >
                    <p>Action Readiness</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Radar
              data={dataRadar}
              options={dataRadar.options}
              className="w-75 h-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPDR;
