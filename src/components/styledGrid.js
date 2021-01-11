import Grid from "@material-ui/core/Grid";
import useStyles from "../styles/Styles";

const StyledGrid = (props) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.grid}
      container
      direction="column"
      alignItems="center"
      justify="center"
      {...props}
    />
  );
};

export default StyledGrid;
