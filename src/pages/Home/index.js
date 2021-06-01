/* eslint-disable arrow-body-style */
import React from 'react';
import { Grid, Row, Col } from 'rsuite';
import { Switch, Route, useRouteMatch } from 'react-router';
import SideBar from '../../components/SideBar';
import { RoomsProvider } from '../../context/rooms.context';
// eslint-disable-next-line import/no-unresolved
import Chat from './Chat';
import { useMediaQuery } from '../../misc/customHooks';
import WelcomeVector from '../../images/welcomeVector.svg';

const Home = () => {
    const isDesktop = useMediaQuery('(min-width: 992px)');
    const { isExact } = useRouteMatch();
    const canRenderSidebar = isDesktop || isExact;
    return (
        <RoomsProvider>
            <Grid fluid className="h-100">
                <Row className="h-100">
                    {canRenderSidebar && (
                        <Col xs={24} md={8} className="h-100">
                            <SideBar />
                        </Col>
                    )}
                    <Switch>
                        <Route exact path="/chat/:chatId">
                            <Col xs={24} md={16} className="h-100 ms-0">
                                <Chat />
                            </Col>
                        </Route>
                        <Route>
                            {isDesktop && (
                                <Col xs={24} md={16} className="h-100">
                                    <div className="flex-column h-100 align-items-center justify-content-center fle">
                                        <div className="illustration">
                                            <img
                                                src={WelcomeVector}
                                                alt="illustration"
                                            />
                                        </div>
                                        <h3 className="text-center">
                                            Please Select any Chat!
                                        </h3>
                                    </div>
                                </Col>
                            )}
                        </Route>
                    </Switch>
                </Row>
            </Grid>
        </RoomsProvider>
    );
};

export default Home;
