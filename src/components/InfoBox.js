import React from "react"
import { Card, CardContent, Typography } from "@material-ui/core"
import "./InfoBox.css"

const InfoBox = (props) => {
  const { title, cases, total, active, onClick, isRed, isGreen, isGray } = props
  return (
    <Card
      className={`infobox ${active && "infobox--selected"} ${
        isRed && "infobox--red"
      }`}
      onClick={onClick}
    >
      <CardContent>
        <Typography color="textSecondary" className="infobox__title">
          {title}
        </Typography>
        <h2
          className={`infobox__cases ${
            !isRed && !isGray && "infobox__cases--green"
          }`}
        >
          {cases}
        </h2>
        <Typography color="textSecondary" className="infobox__total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
