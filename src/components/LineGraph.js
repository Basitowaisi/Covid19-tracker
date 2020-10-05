import axios from "axios"
import numeral from "numeral"
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { buildChartJSData } from "../utils"
import "./LineGraph.css"

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0")
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YYYY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a")
          },
        },
      },
    ],
  },
}

const LineGraph = ({ casesType = "cases", countryName }) => {
  const [data, setData] = useState({})
  useEffect(() => {
    const getData = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then(({ data }) => {
          const chartData = buildChartJSData(data, casesType)
          setData(chartData)
        })
    }
    getData()
  }, [casesType])
  return (
    <div className="lineGraph">
      <h1 className="lineGraph__heading">
        {countryName} new {casesType}
      </h1>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204,16,52,.5)",
                borderColor: "#cc1034",

                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  )
}

export default LineGraph
