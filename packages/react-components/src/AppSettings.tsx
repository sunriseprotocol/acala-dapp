import React, { FC, useCallback } from 'react';
import { Drawer } from 'antd';

import { useSetting } from '@acala-dapp/react-hooks';
import { DEFAULT_ENDPOINTS } from '@acala-dapp/react-environment/configs/endpoints';
import { Radio, CloseIcon } from '@acala-dapp/ui-components';

import classes from './AppSettings.module.scss';

const LanguageConfig = [
  {
    key: 'English',
    value: 'en'
  },
  {
    key: 'Chinese',
    value: 'zh'
  }
];

export const AppSettings: FC = () => {
  const {
    changeEndpoint,
    closeSetting,
    endpoint,
    language,
    setLanguage,
    settingVisible
  } = useSetting();

  const handleEndpoint = useCallback((endpoint: string) => {
    changeEndpoint(endpoint);

    window.location.reload();
  }, [changeEndpoint]);

  const handleLanguage = useCallback((language: string) => {
    setLanguage(language as any);
  }, [setLanguage]);

  return (
    <Drawer
      className={classes.root}
      closeIcon={<CloseIcon />}
      onClose={closeSetting}
      placement='left'
      visible={settingVisible}
      width={520}
    >
      <div>
        <div className={classes.settingItem}>
          <p className={classes.title}>Select Network</p>
          <div className={classes.settingContent}>
            <ul className={classes.list}>
              {
                DEFAULT_ENDPOINTS.testnet.map((config) => {
                  return (
                    <li
                      className={classes.listItem}
                      key={`endpoint-${config.url}`}
                      onClick={(): void => handleEndpoint(config.url)}
                    >
                      <div>{config.name}</div>
                      <Radio
                        checked={endpoint === config.url}
                      />
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
        <div className={classes.settingItem}>
          <p className={classes.title}>Language</p>
          <div className={classes.settingContent}>
            <ul className={classes.list}>
              {
                LanguageConfig.map((config) => {
                  return (
                    <li
                      className={classes.listItem}
                      key={`language-${config.value}`}
                      onClick={(): void => handleLanguage(config.value)}
                    >
                      <div>{config.key}</div>
                      <Radio
                        checked={language === config.value}
                      />
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
