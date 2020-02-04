import React from 'react';
import {
    withStyles,
    Grid,
    Paper,
    Button,
    Theme,
    Typography,
    createStyles,
    makeStyles,
    IconButton,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import CloseIcon from '@/components/svgs/close';
import Loan from '@/components/svgs/loan';
import { createTypography } from '@/theme';

const Card = withStyles(() => ({
    root: { padding: '47px 54px 98px 54px' },
}))(Paper);

const Title = withStyles((theme: Theme) => ({
    root: {
        marginTop: 45,
        ...createTypography(21, 28, 500, 'Roboto', theme.palette.primary.light),
    },
}))(Typography);

const useStyles = makeStyles(() =>
    createStyles({
        img: {
            marginTop: 68,
            marginBottom: 43,
            width: '100%',
            maxWidth: 330,
        },
    }),
);

interface Props {
    onConfirm: () => void;
}

const Success: React.FC<Props> = ({ onConfirm }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    return (
        <Card square={true} elevation={1}>
            <Grid container justify="flex-end" onClick={onConfirm}>
                <IconButton>
                    <CloseIcon />
                </IconButton>
            </Grid>
            <Grid container justify="center" alignItems="center" direction="column">
                <Title>{t('Your loan is created, and aUSD is generated!')}</Title>
                <Loan className={classes.img} />
                <Button variant="contained" color="primary" onClick={onConfirm}>
                    DONE
                </Button>
            </Grid>
        </Card>
    );
};

export default Success;
