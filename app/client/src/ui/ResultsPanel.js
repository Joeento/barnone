import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';


const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  results: {
    maxHeight: '80vh', 
    overflowY: 'auto'
  },
  image_tile: {
    width: '100%',
    height: 'auto'
  }
});

class ResultsPanel extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <div className={classes.results}>
          <GridList cols={3} spacing={24}>
            {this.props.barcodes.map(tile => (
              <GridListTile key={tile._id}>
                <img className={classes.image_tile} src={'/public/barcodes/' + tile._id + '/result.png'} alt={tile.value} />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </Paper>
    );
  }
}

ResultsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultsPanel);
