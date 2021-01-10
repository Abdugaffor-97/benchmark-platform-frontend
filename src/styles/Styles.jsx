import { makeStyles } from "@material-ui/core";

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
    margin: `${theme.spacing(15)}px auto`,
    padding: theme.spacing(2),
    backgroundColor: "#666666",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    color: "red",
    padding: "0 5px",
  },
  button: {
    width: "100%",
  },
}));

export default useStyles;
