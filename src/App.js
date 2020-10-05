import React, { useState, useEffect } from "react"
import axios from "axios"
import InfoBox from "./components/InfoBox"
import Map from "./components/Map"
import Table from "./components/Table"
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core"
import "./App.css"
import { sortData, prettyStats } from "./utils"
import LineGraph from "./components/LineGraph"
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide")
  const [casesType, setCasesType] = useState("cases")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [countryName, setCountryName] = useState("Worldwide")

  useEffect(() => {
    const getCountriesData = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/countries")
        .then((res) => {
          const _countries = res.data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }))

          const sortedData = sortData(res.data)
          setTableData(sortedData)
          setMapCountries(res.data)
          setCountries(_countries)
        })
    }
    getCountriesData()
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await axios.get("https://disease.sh/v3/covid-19/all").then(({ data }) => {
        setCountryInfo(data)
      })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    const url =
      countryCode == "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await axios.get(url).then(({ data }) => {
      console.log(data)
      setCountry(countryCode)
      setCountryInfo(data)

      if (countryCode != "worldwide") {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setCountryName(data.country)
      } else {
        setCountryName("Worldwide")
        setMapCenter({
          lat: 20.5937,
          lng: 78.9629,
        })
      }
      setMapZoom(3.5)
    })
  }

  console.log(country)

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide" key="worldwide">
                Worldwide
              </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            active={casesType == "cases"}
            cases={prettyStats(countryInfo.todayCases)}
            total={prettyStats(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
            active={casesType == "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyStats(countryInfo.todayRecovered)}
            total={prettyStats(countryInfo.recovered)}
          ></InfoBox>
          <InfoBox
            isGray
            active={casesType == "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Total"
            cases={prettyStats(countryInfo.todayDeaths)}
            total={prettyStats(countryInfo.deaths)}
          ></InfoBox>
        </div>
        <Map
          center={mapCenter}
          casesType={casesType}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
        </CardContent>
        {/* <h3 className="app__graphTitle">
          {countryName} new {casesType}
        </h3> */}
        <LineGraph casesType={casesType} countryName={countryName} />
      </Card>
    </div>
  )
}

export default App
