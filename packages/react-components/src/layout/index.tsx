import React, { FC, memo, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApi, useBreakpoint, useIsAppReady, useSetting } from '@acala-dapp/react-hooks';
import { styled, PageLoading, Page } from '@acala-dapp/ui-components';

import { Sidebar, SidebarConfig } from '../Sidebar';
import { useStore } from '@acala-dapp/react-environment';
import { AccountBar } from '../AccountBar';
import { noop } from 'lodash';

const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

interface MainLayoutProps {
  sidebar: SidebarConfig;
  enableCollapse?: boolean;
}

const Main: FC<MainLayoutProps> = memo(({
  children,
  enableCollapse = true,
  sidebar
}) => {
  const { init } = useApi();
  const { allEndpoints, endpoint } = useSetting();
  const screen = useBreakpoint();
  const isAppReady = useIsAppReady();
  const ui = useStore('ui');
  const collapse = useMemo(() => enableCollapse ? !(screen.xl ?? true) : false, [enableCollapse, screen]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!endpoint) return;

    if (isAppReady) return;

    // initialize api
    init(endpoint, allEndpoints);
  }, [init, endpoint, allEndpoints, isAppReady]);

  const breadcrumb = useMemo(() => {
    if (ui.breadcrumb.length === 0) return [];

    return [
      ...ui.breadcrumb.map((item) => ({
        ...item,
        onClick: (): void => {
          navigate(item.path);
        }
      })),
      {
        content: ui.pageTitle,
        onClick: noop
      }
    ];
  }, [ui.breadcrumb, navigate, ui.pageTitle]);

  const content = useMemo(() => {
    if (!isAppReady) return <PageLoading />;

    return (
      <Page>
        <Page.Title
          breadcrumb={breadcrumb}
          extra={<AccountBar />}
          title={ui.pageTitle}
        />
        <Page.Content>{children}</Page.Content>
      </Page>
    );
  }, [isAppReady, ui.pageTitle, breadcrumb, children]);

  return (
    <MainContainer>
      <Sidebar
        collapse={collapse}
        config={sidebar}
        showAccount={true}
      />
      {content}
    </MainContainer>
  );
});

Main.displayName = 'Main';

const Layout = { Main };

export { Layout };
