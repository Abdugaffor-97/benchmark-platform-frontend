import { Grid, Paper, Typography, Button } from "@material-ui/core";
import useStyles from "../styles/Styles";

const Question = ({
  currentQuestion,
  providedAnswer,
  submitQuestion,
  updateProvidedAns,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Typography style={{ color: "#00FF84" }}>
          {currentQuestion.text}
        </Typography>
        <br />
        <form onSubmit={submitQuestion}>
          <Typography>Select your answer</Typography>
          {currentQuestion.answers.map((ans, idx) => (
            <div key={idx}>
              <input
                type="radio"
                id={idx}
                name={providedAnswer.question}
                value={ans.text}
                onChange={() => updateProvidedAns(idx)}
              />
              {"  "}
              <label style={{ color: "red", fontSize: 20 }} htmlFor={idx}>
                {ans.text}
              </label>
              <br></br>
            </div>
          ))}
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Grid>
    </Paper>
  );
};

export default Question;
