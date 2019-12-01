import { Checkbox } from  '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
  
const styles = theme => ({
    root: {
      '&$checked': {
        color: '#6CB33F',
      },
    },
    checked: {},
   });

export const SimpleCheckbox = withStyles(styles)(Checkbox);
