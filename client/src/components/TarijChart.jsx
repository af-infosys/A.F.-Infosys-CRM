import React from "react";
import toGujaratiNumber from "./toGujaratiNumber";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts"; // ગ્રાફ માટે

import House1 from "../assets/icon/analytics/House.png";
import House2 from "../assets/icon/analytics/PakaMakan.png";
import House3 from "../assets/icon/analytics/KachaMakan.png";

import houseTax from "../assets/icon/tax/houseTax.png";
import waterTax from "../assets/icon/tax/waterTax.png";
import specialTax from "../assets/icon/tax/specialTax.png";
import lightTax from "../assets/icon/tax/lightTax.png";
import cleanTax from "../assets/icon/tax/cleanTax.png";

const TarijChart = ({ project, total, totalResidence, name }) => {
  console.log("Tarij", total);

  return (
    <div id="pdf-content-wrapper" className="watermark">
      <h1
        className="text-xl font-bold text-center mb-0 text-gray-800"
        style={{ paddingTop: "80px" }}
      >
        ચાર્ટ તારીજ કુલ માંગણાં નો રિપોર્ટ (તારીજ) {name && ` - ${name}`} સને{" "}
        {project?.details?.taxYear || ""}
      </h1>

      <div
        className="location-info-visible"
        style={{
          paddingInline: "200px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <h3>ગામ: {project?.spot?.gaam}</h3>

        <h3>તાલુકો: {project?.spot?.taluka}</h3>

        <h3>જિલ્લો: {project?.spot?.district}</h3>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            justifyContent: "center",
            maxWidth: "50px",
          }}
        >
          <img src={House1} style={{ width: "100%" }} />
          <img src={House2} style={{ width: "100%" }} />
          <img src={House3} style={{ width: "100%" }} />
        </div>

        <div className="flex flex-col items-center">
          {/* <h3 className="text-xl font-bold mb-4"></h3> */}
          <BarChart
            width={150}
            height={400}
            margin={{ top: 30 }}
            data={[
              {
                name: `કુલ ઘર `,
                count: totalResidence || 0,
              },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" barSize={60}>
              <Cell fill="#c4b28f" />

              <LabelList
                dataKey="count"
                position="top"
                style={{ fill: "#000", fontSize: 14, fontWeight: "700" }}
              />
            </Bar>
          </BarChart>
        </div>

        <div
          className="flex flex-col items-center"
          style={{ marginLeft: "50px" }}
        >
          {/* <h3 className="text-xl font-bold mb-4"></h3> */}
          <BarChart
            width={800}
            height={400}
            margin={{ top: 30 }}
            data={[
              {
                name: `ઘર વેરો`,
                count: total?.houseTax?.curr || 0,
              },
              {
                name: `સામાન્ય પાણી વેરો`,
                count: total?.waterTax?.curr || 0,
              },
              {
                name: `ખાસ પાણી વેરો`,
                count: total?.specialTax?.curr || 0,
              },
              {
                name: `લાઈટ વેરો`,
                count: total?.lightTax?.curr || 0,
              },
              {
                name: `સફાઈ વેરો`,
                count: total?.cleanTax?.curr || 0,
              },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" barSize={60}>
              <Cell fill="#2ECC71" />
              <Cell fill="#E74C3C" />
              <Cell fill="#9B59B6" />
              <Cell fill="#F39C12" />
              <Cell fill="#3498DB" />

              <LabelList
                dataKey="count"
                position="top"
                style={{ fill: "#000", fontSize: 14, fontWeight: "700" }}
              />
            </Bar>
          </BarChart>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "100px",
          justifyContent: "center",
          maxHeight: "70px",
          paddingLeft: "310px",

          marginTop: "5px",
        }}
      >
        <img src={houseTax} style={{ width: "50px" }} />
        <img src={waterTax} style={{ width: "50px" }} />
        <img src={specialTax} style={{ width: "50px" }} />
        <img src={lightTax} style={{ width: "50px" }} />
        <img src={cleanTax} style={{ width: "50px" }} />
      </div>
    </div>
  );
};

export default TarijChart;
