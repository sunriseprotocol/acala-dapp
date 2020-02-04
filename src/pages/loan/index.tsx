import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, makeStyles, createStyles, Theme } from '@material-ui/core';

import actions from '@/store/actions';
import { COLLATERAL, STABLE_COIN, assets } from '@/config';
import { accountVaultsSelector } from '@/store/vault/selectors';
import useMobileMatch from '@/hooks/mobile-match';

import Page from '@/components/page';
import PricesFeed from './components/prices-feed';
import VaultsList from './components/vaults-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import VaultPanel from './components/vault-panel';
import TransactionHistory from './components/transactions-history';
import VaultInfo from './components/vault-info';
import AddVault from './components/add-vault';
import WalletBalance from './components/account-balance';
import { loadingSelector } from '@/store/loading/reducer';
import { FETCH_VAULTS } from '@/store/vault/actions';
import Skeleton from '@material-ui/lab/Skeleton';
import Guide from './components/guide';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        detail: {
            marginTop: 57,
            [theme.breakpoints.down('sm')]: {
                marginTop: 0,
            },
        },
        systemInfo: {
            flex: '0 0 349px',
            marginLeft: 48,
            [theme.breakpoints.down('md')]: {
                flex: '1 1 100%',
                marginTop: 32,
                marginLeft: 0,
            },
        },
        vaultInfo: {
            [theme.breakpoints.down('sm')]: {
                marginTop: 32,
            },
        },
    }),
);

const Loan: React.FC = () => {
    const initStatus = useRef<boolean>(false);
    const dispatch = useDispatch();
    const [currentVault, setCurrentVault] = useState<number>(0);
    const [addVault, setAddVault] = useState<boolean>(false);
    const userVaults = useSelector(accountVaultsSelector);
    const isLoadingVault = useSelector(loadingSelector(FETCH_VAULTS))
    const classes = useStyle();
    const showAddVault = () => setAddVault(true);
    const hideAddVault = () => setAddVault(false);
    const match = useMobileMatch('sm');
    const mdMatch = useMobileMatch('md');

    useEffect(() => {
        // fetch user vaults info
        dispatch(actions.vault.fetchVaults.request(COLLATERAL));
        // fetch user asset balance
        dispatch(actions.account.fetchAssetsBalance.request(Array.from(assets.keys())));
        // fetch tokens total issuance
        dispatch(actions.chain.fetchTotalIssuance.request([STABLE_COIN]));
        // fetch system vaults info
        dispatch(actions.chain.fetchVaults.request(COLLATERAL));
        // load tx record
        dispatch(actions.vault.loadTxRecord());
    }, [dispatch]);

    useEffect(() => {
        // set default vault
        if (userVaults.length && initStatus.current === false) {
            setCurrentVault(userVaults[0].asset);
            initStatus.current = true;
        }
    }, [userVaults, initStatus]);

    const handleVaultSelect = (vault: number) => {
        setCurrentVault(vault);
        setAddVault(false);
    };

    const renderVault = () => {
        if (typeof isLoadingVault !== 'boolean') {
            return null
        } 
        if (isLoadingVault === true) {
            return <Skeleton variant="rect" width="100%" height={500} />;
        }
        if (!userVaults.length) {
            return <Guide onConfirm={showAddVault} />
        }
        return (
            <>
                <VaultInfo current={currentVault} />
                <Box paddingTop={match ? 4 : 7} />
                <VaultPanel current={currentVault} />
                <Box paddingTop={match ? 4 : 7} />
                <TransactionHistory current={currentVault} />
            </>
        );
    }

    return (
        <Page padding={'46px 55px'}>
            <Grid container direction={match ? 'column' : 'row'}>
                <VaultsList onAdd={showAddVault} onSelect={handleVaultSelect} />
            </Grid>
            <Grid
                container
                direction={match ? 'column' : 'row'}
                justify="space-between"
                wrap={mdMatch ? 'wrap' : 'nowrap'}
                className={classes.detail}
            >
                <Grid item xs={12} className={classes.vaultInfo}>
                    {addVault ? <AddVault onCancel={hideAddVault} /> : renderVault() }
                </Grid>
                <Grid item md={12} className={classes.systemInfo}>
                    <WalletBalance />
                    <Box paddingTop={3} />
                    <PricesFeed />
                    <Box paddingTop={3} />
                    <SystemInfo />
                    <Box paddingTop={3} />
                    <CollateralInfo current={currentVault} />
                </Grid>
            </Grid>
        </Page>
    );
};

export default Loan;
