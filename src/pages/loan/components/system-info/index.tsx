import React from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { useSelector } from 'react-redux';
import { specIssuanceSelector } from '@/store/chain/selectors';
import Formatter from '@/components/formatter';
import { STABLE_COIN } from '@/config';
import { BaseProps } from '@/types/react-component/props';

const SystemInfo: React.FC<BaseProps> = ({ className, style }) => {
    const { t } = useTranslate();
    const stableIssuance = useSelector(specIssuanceSelector(STABLE_COIN));

    return (
        <Card
            size="normal"
            elevation={1}
            header={<Typography variant="subtitle1">{t('System Info')}</Typography>}
            className={className}
            style={style}
        >
            <List disablePadding>
                <ListItem disableGutters>
                    <Grid container justify="space-between">
                        <Typography variant="body2">{t('aUSD in Supply')}</Typography>
                        <Typography variant="body2">
                            <Formatter type="price" data={stableIssuance} prefix="$" />
                        </Typography>
                    </Grid>
                </ListItem>
            </List>
        </Card>
    );
};

export default SystemInfo;
