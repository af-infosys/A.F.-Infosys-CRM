import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiPath from "../../isProduction";
import axios from "axios";
import { toast } from "react-toastify";

const TaxEntry = () => {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `${await apiPath()}/api/sheet?workId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setRecords(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);

      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  const [project, setProject] = useState([]);
  const { projectId } = useParams();
  const [taxes, setTaxes] = useState([]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        `${await apiPath()}/api/work/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(data);
      setProject(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateValue = async () => {
    try {
      setLoading(true);
      toast.info("Calucating Values...");

      const data = await axios.put(
        `${await apiPath()}/api/sheet/ordervaluation/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(data?.data?.data || []);
      setProject(data?.data?.data || []);

      toast.success("Calculation Completed.");
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      let fetchedData = await axios.get(
        `${await apiPath()}/api/valuation/tax/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      fetchedData = fetchedData?.data?.taxes;
      console.log(fetchedData);

      if (fetchedData && fetchedData.length > 0) {
        setTaxes(fetchedData);
        toast.success("Tax Data Fetched Successfully.");
      } else {
        toast.info("No Tax Data Found! try adding new Data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Fetching Taxes Data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchRecords();
    fetchTaxes();
  }, []);

  return (
    <div className="visible-report-container">
      <h1 className="text-xl font-bold text-center mb-0 text-gray-800">
        ગામનો નમુના નંબર ૯ ડી - કરવેરા રજીસ્ટર - સન ૨૦૨૫/૨૬
      </h1>

      <h2 className="text-l text-center mb-2 text-gray-600">
        સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની
        યાદી
      </h2>

      <div className="location-info-visible">
        <h3>ગામ:- {project?.spot?.gaam}</h3>

        <h3>તાલુકો:- {project?.spot?.taluka}</h3>

        <h3>જિલ્લો:- {project?.spot?.district}</h3>
      </div>

      <div className="table-responsive">
        <table className="report-table">
          <thead className="thead">
            <tr>
              <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                અનું ક્રમાંક
              </th>

              <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                મિલ્કત ક્રમાંક
              </th>

              <th className="th" rowSpan="2" style={{ minWidth: "130px" }}>
                વિસ્તારનું નામ
              </th>

              <th className="th" rowSpan="2" style={{ minWidth: "170px" }}>
                ખાતેદારનું નામ
              </th>

              <th className="th" rowSpan="2" style={{ minWidth: "100px" }}>
                પહોચ નંબર તારીખ રકમ
              </th>

              <th className="th" rowSpan="2" style={{ minWidth: "100px" }}>
                વિગત
              </th>

              <th className="th" colSpan="3" style={{ minWidth: "70px" }}>
                ઘર વેરો
              </th>

              <th className="th" colSpan="3" style={{ minWidth: "130px" }}>
                સામાન્ય પાણી વેરો
              </th>

              <th className="th" colSpan="3" style={{ minWidth: "120px" }}>
                ખાસ પાણી નળ વેરો
              </th>

              <th className="th" colSpan="3">
                દિવાબતી લાઈટ વેરો
              </th>

              <th className="th" colSpan="3" style={{ minWidth: "130px" }}>
                સફાઈ વેરો
              </th>

              <th className="th" colSpan="3" style={{ minWidth: "130px" }}>
                કુલ એકંદર
              </th>

              <th className="th" rowSpan="2">
                ગઈ સાલના જાદે
              </th>
            </tr>

            <tr>
              {Array.from({ length: 6 }).map((_, index) => (
                <>
                  <th className="th">પા.બા</th>

                  <th className="th">ચાલુ</th>

                  <th className="th">કુલ</th>
                </>
              ))}
            </tr>

            {/* Index Start */}
            <tr>
              {/* 1 to 18 th for index */}
              {Array.from({ length: 25 }).map((_, index) => (
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{
                    textAlign: "center",
                    color: "black",
                    background: "transparent",
                  }}
                  key={index}
                >
                  {index + 1}
                </th>
              ))}
            </tr>
            {/* Index End */}
          </thead>

          <tbody className="tbody">
            {records.map((record, index) => (
              <>
                <tr
                  key={index}
                  onClick={() =>
                    window.open(`/survay/taxform/${projectId}/${record[0]}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="td" rowSpan="3">
                    {record[0]}
                  </td>

                  <td className="td" rowSpan="3">
                    {record[2]}
                  </td>

                  <td className="td" rowSpan="3">
                    {record[1]}
                  </td>

                  <td className="td" rowSpan="3">
                    {record[3]}
                  </td>

                  <td className="td" rowSpan="3">
                    {JSON.parse(record[24] || "{}")?.receipt?.pNo || ""}
                    {JSON.parse(record[24] || "{}")?.receipt?.date || ""}
                    {JSON.parse(record[24] || "{}")?.receipt?.amount || ""}
                  </td>

                  <td className="td">માંગણું</td>

                  {/* ઘર વેરો */}
                  <td className="td">{record[22] || ""}</td>
                  <td className="td">{record[20] || ""}</td>
                  <td className="td">
                    {Number(record[20] || " ") + Number(record[22] || " ")}
                  </td>

                  {/* [{ "curr": 20, "prev": 0 }, { "curr": 0, "prev": 0 }, { "curr": 0, "prev": 0 }] */}
                  {/* સામાન્ય પાણી વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.normal_water?.prev ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.normal_water?.curr ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.normal_water?.curr ||
                          " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.normal_water?.prev ||
                            " ",
                        )}
                    </span>
                  </td>

                  {/* ખાસ પાણી નળ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.special_water?.prev ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.special_water?.curr ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.special_water?.curr ||
                          " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.special_water?.prev ||
                            " ",
                        )}
                    </span>
                  </td>

                  {/* દિવાબતી લાઈટ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.light?.prev || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.light?.curr || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.light?.curr || " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.light?.prev || " ",
                        )}
                    </span>
                  </td>

                  {/* સફાઈ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.cleaning?.prev || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.cleaning?.curr || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.cleaning?.curr || " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.cleaning?.prev || " ",
                        )}
                    </span>
                  </td>

                  {/* કુલ એકંદર */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(record[22] || " ") +
                        Number(
                          JSON.parse(record[23] || "{}")?.normal_water?.prev ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.special_water?.prev ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.light?.prev || " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.cleaning?.prev || " ",
                        )}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(record[20] || " ") +
                        Number(
                          JSON.parse(record[21] || "{}")?.normal_water?.curr ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.special_water?.curr ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.light?.curr || " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.cleaning?.curr || " ",
                        )}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(record[20] || " ") +
                        Number(record[22] || " ") +
                        Number(
                          JSON.parse(record[21] || "{}")?.normal_water?.curr ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.special_water?.curr ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.light?.curr || " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.cleaning?.curr || " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.normal_water?.prev ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.special_water?.prev ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.light?.prev || " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.cleaning?.prev || " ",
                        )}
                    </span>
                  </td>

                  {/* ગઈ સાલના જાદે */}
                  <td className="td" rowSpan={3}></td>
                </tr>

                <tr
                  onClick={() =>
                    window.open(`/survay/taxform/${projectId}/${record[0]}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="td">
                    <span className="formatting">વસુલાત</span>
                  </td>

                  {/* ઘર વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[24] || "{}")?.vasulat?.prevtax || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[24] || "{}")?.vasulat?.currtax || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {(JSON.parse(record[24] || "{}")?.vasulat?.prevtax ||
                        " ") +
                        (JSON.parse(record[24] || "{}")?.vasulat?.currtax ||
                          " ")}
                    </span>
                  </td>

                  {/* સામાન્ય પાણી વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.normal_water?.vasulat ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.normal_water?.vasulat ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.normal_water?.vasulat ||
                          " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.normal_water
                            ?.vasulat || " ",
                        )}
                    </span>
                  </td>

                  {/* ખાસ પાણી નળ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.special_water?.vasulat ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.special_water?.vasulat ||
                        " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.special_water
                          ?.vasulat || " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.special_water
                            ?.vasulat || " ",
                        )}
                    </span>
                  </td>

                  {/* દિવાબતી લાઈટ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.light?.vasulat || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.light?.vasulat || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.light?.vasulat || " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.light?.vasulat || " ",
                        )}
                    </span>
                  </td>

                  {/* સફાઈ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.cleaning?.vasulat || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[21] || "{}")?.cleaning?.vasulat || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[21] || "{}")?.cleaning?.vasulat ||
                          " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.cleaning?.vasulat ||
                            " ",
                        )}
                    </span>
                  </td>

                  {/* કુલ એકંદર */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[24] || "{}")?.vasulat?.prevtax || " ",
                      ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.normal_water?.prev ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.special_water?.prev ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.light?.prev || " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.cleaning?.prev || " ",
                        )}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[24] || "{}")?.vasulat?.currtax || " ",
                      ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.normal_water?.curr ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.special_water?.curr ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.light?.curr || " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.cleaning?.curr || " ",
                        )}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {Number(
                        JSON.parse(record[24] || "{}")?.vasulat?.prevtax || " ",
                      ) +
                        Number(
                          JSON.parse(record[24] || "{}")?.vasulat?.currtax ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.normal_water
                            ?.vasulat || " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.special_water
                            ?.vasulat || " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.light?.vasulat || " ",
                        ) +
                        Number(
                          JSON.parse(record[21] || "{}")?.cleaning?.vasulat ||
                            " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.normal_water
                            ?.vasulat || " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.special_water
                            ?.vasulat || " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.light?.vasulat || " ",
                        ) +
                        Number(
                          JSON.parse(record[23] || "{}")?.cleaning?.vasulat ||
                            " ",
                        )}
                    </span>
                  </td>

                  {/* ગઈ સાલના જાદે */}
                  {/* <td className="td"></td> */}
                </tr>

                <tr
                  onClick={() =>
                    window.open(`/survay/taxform/${projectId}/${record[0]}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="td">
                    <span className="formatting">બાકી</span>
                  </td>

                  {/* ઘર વેરો */}
                  <td className="td">
                    {Number(record[22] || 0) -
                      Number(
                        JSON.parse(record[24] || "{}")?.vasulat?.prevtax || 0,
                      )}
                  </td>
                  <td className="td">
                    {Number(record[20] || 0) -
                      Number(
                        JSON.parse(record[24] || "{}")?.vasulat?.currtax || 0,
                      )}
                  </td>
                  <td className="td">
                    {Number(record[22] || 0) -
                      Number(
                        JSON.parse(record[24] || "{}")?.vasulat?.prevtax || 0,
                      ) +
                      (Number(record[20] || 0) -
                        Number(
                          JSON.parse(record[24] || "{}")?.vasulat?.currtax || 0,
                        ))}
                  </td>

                  {/* સામાન્ય પાણી વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[22] || "{}")?.[1]?.prev || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[22] || "{}")?.[1]?.curr || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {(JSON.parse(record[22] || "{}")?.[1]?.curr || " ") +
                        (JSON.parse(record[22] || "{}")?.[1]?.prev || 0)}
                    </span>
                  </td>

                  {/* ખાસ પાણી નળ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.[1]?.prev || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[23] || "{}")?.[1]?.curr || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {(JSON.parse(record[23] || "{}")?.[1]?.curr || " ") +
                        (JSON.parse(record[23] || "{}")?.[1]?.prev || 0)}
                    </span>
                  </td>

                  {/* દિવાબતી લાઈટ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[24] || "{}")?.[1]?.prev || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[24] || "{}")?.[1]?.curr || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {(JSON.parse(record[24] || "{}")?.[1]?.curr || " ") +
                        (JSON.parse(record[24] || "{}")?.[1]?.prev || 0)}
                    </span>
                  </td>

                  {/* સફાઈ વેરો */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[25] || "{}")?.[1]?.prev || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[25] || "{}")?.[1]?.curr || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {(JSON.parse(record[25] || "{}")?.[1]?.curr || " ") +
                        (JSON.parse(record[25] || "{}")?.[1]?.prev || 0)}
                    </span>
                  </td>

                  {/* કુલ એકંદર */}
                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[26] || "{}")?.[1]?.prev || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {JSON.parse(record[26] || "{}")?.[1]?.curr || " "}
                    </span>
                  </td>

                  <td className="td" style={{ textAlign: "right" }}>
                    <span className="formatting">
                      {(JSON.parse(record[26] || "{}")?.[1]?.curr || " ") +
                        (JSON.parse(record[26] || "{}")?.[1]?.prev || 0)}
                    </span>
                  </td>
                </tr>
              </>
            ))}

            {records.length === 0 && !loading && !error && (
              <tr>
                <td colSpan="14" className="td text-center">
                  કોઈ રેકોર્ડ ઉપલબ્ધ નથી.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxEntry;
