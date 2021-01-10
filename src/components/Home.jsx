import { withRouter } from "react-router-dom";
import { useState } from "react";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import useStyles from "../styles/Styles";

const Home = (props) => {
  const [name, setName] = useState("");
  const classes = useStyles();
  return (
    <div className={classes.grid}>
      <Typography
        style={{ color: "#00FF84" }}
        variant="h3"
        component="h2"
        gutterBottom
      >
        Assessment & Benchmarking
      </Typography>
      <Paper className={classes.paper}>
        <Grid className={classes.grid}>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              error
              className={classes.input}
              id="candidate-name"
              label="Enter Your Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  // e.preventDefault();
                  props.history.push(`/start?name=${name}`);
                }
              }}
            />
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={() => props.history.push(`/start?name=${name}`)}
            >
              Start
            </Button>
          </form>
        </Grid>
      </Paper>
    </div>
  );
};

export default withRouter(Home);
