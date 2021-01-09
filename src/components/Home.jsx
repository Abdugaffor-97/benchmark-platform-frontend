import { withRouter } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  grid: {
    flexGrow: 1,
    overflow: "hidden",
    padding: theme.spacing(0, 3),
  },
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  input: {
    width: "100%",
  },
}));

const Home = (props) => {
  const [name, setName] = useState("");
  const classes = useStyles();
  return (
    <div className={classes.grid}>
      <Typography variant="h3" component="h2" gutterBottom>
        Assessment & Benchmarking
      </Typography>
      <Paper className={classes.paper}>
        <Grid className={classes.grid}>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              className={classes.input}
              id="candidate-name"
              label="Enter Your Name"
              variant="outlined"
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
              className={classes.input}
              variant="contained"
              color="primary"
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
